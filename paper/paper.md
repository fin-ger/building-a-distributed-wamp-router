# Introduction

For modern web pages the importance of realtime data delivery rose during the last years. This created new requirements for web applications where server rendered content was previously used. Technologies like ajax, jsonrpc, socket.io, websockets, and many more arose to fit the needs for realtime data delivery to the web browser. During the same time micro-services got more important in the backend to create scalable and robust applications. A micro-service is a minimalistic application for a single responsibility. A distributed application can be created by interconnecting the micro-services. Technologies supporting the development of micro-service infrastructures arose like gRPC, captn-proto, Apache Thrift, Java RMI, and many more. As well as the web technologies, the micro-services needed realtime communication between application components on different machines.

In the year 2012 WAMP (Web-Advanced-Messaging-Protocol) appeared as an open and free protocol which combines the requirements of a micro-service infrastructure with modern web technologies, providing a single solution for frontend and backend application development. It implements a publish and subscribe messaging pattern as well as routed remote procedure calls (RPCs). This enables application developers to use a unified interconnect between application components for two different messaging patterns. The protocol was primarily built on top of web-sockets which enables web pages inside the web browser to participate as part of the micro-service infrastructure. This makes it considerably easier for a web-page to communicate with the backend in realtime. Currently the protocol also supports other transportation layers beside web-sockets, which makes the protocol more flexible in backend application development. 

WAMP requires a central server where all services (backend and frontend) are connected to. The server than routes topic publications and remote procedure calls to these services (clients). The applications built on this technology are implemented as components that are distributed over multiple machines that communicate with each other via WAMP. This can enable an application to be resistant against local machine failures as other machines are still hosting the application on a different location. The reference implementation router (crossbar from crossbar.io Technologies GmbH) runs as a single server instance on a single machine. This introduces a single-point-of-failure to a technology that was designed to be resistant against local machine failures. To counteract this, crossbar.io provides a closed-source commercial router implementation (crossbarFX) that implements a logically central router which is physically distributed over multiple machines. There are other router implementations that also support distributing the routing application over multiple physical machines (like bondy).

This paper will describe one possible solution to the problems that implementations for distributed WAMP routing applications have to face. A prototypical implementation was developed during the making of this paper called autobahnkreuz which implements the described solution.

# Sharing State

The central problem when implementing a distributed application is sharing the state of one instance of the application (replica) to all other replicas. The state of an application is the data that is needed for the application to define its behavior. When the state of a single application with several replicas gets out of sync, the behavior of an individual replica may differ from the behavior of other replicas. This can lead to severe damage of the underlying data, downtimes for the provided services, and even data leaks which may penetrate the security of a server.

## Existing Solutions

A possible solution to this problem is to manage the data outside of the application and let another application handle the state synchronization. There are several applications available that can manage data over multiple machines. Most notably distributed databases, key-value stores and filesystems.

### Distributed Databases and Key-Value Stores

Databases and key-value stores provide a logically centralized view when accessing the stored data. This enables applications to be implemented as stateless services, that ask at the central database for the current state of the application. By storing no state in the application itself, it can be replicated by just starting several instances of the application. This works because all replicas of the application are accessing the application state via the central database. The database implementation is then responsible for distributing the state over multiple machines. There are several distributed databases available that provide exactly this functionality. E.g. PostgreSQL, MariaDB, etcd, and TiKV/TiDB.

### Distributed Filesystems

A distributed filesystem is a filesystem that runs on multiple machines at the same time. The files available on the filesystem are the same on every machine. When changing the files, the changes take effect on every machine that is part of the distributed filesystem. Distributed filesystems are very good at synchronizing large quantities of data between multiple machines. Examples are GlusterFS, Ceph, BeeGFS, HDFS, and AFS.

### Consensus Algorithms

To prevent state inconsistencies between replicas, consensus algorithms can be used to synchronize data between machines, after a consensus is reached about a state change. This can be implemented by starting an election for a state change. The machines in the cluster must vote in the election for the state change. A majority of the machines has to approve the state change to take effect. Otherwise, the state change gets rejected and a new election must be started. To prevent elections for every state change, algorithms exist that install a leader in the cluster which is exclusively granted the right to change the state of the cluster. The leader gets elected by the cluster members when no leader is known by the members. All other members of the cluster enter a follower state, where the state changes of the leader are followed. When a follower receives a request to change the state, it has to forward the state change to the current leader.

## Other Implementations

There are existing WAMP router implementations that provide cloud-native functionality. Crossbar.io FX is a commercial routing application by Crossbar.io GmbH which provides cloud and large-scale routing for enterprise applications. The router consists of two components: Crossbar FX Edge and Crossbar FX Master. The former provides local routing capabilities and edge application component management. Crossbar FX Master provides large-scale routing by connecting multiple master and edge instances.

Bondy is another open source WAMP routing application written in Erlang that provides horizontal scaling. It is developed by Leapsight and uses Partisan for cluster membership management, Plumtree for epidemic broadcasting, and an eventual consistent data store. The application is currently under active development. At this point there exists no release of Bondy.

When not focusing on the WAMP protocol, there exist many cloud-native message routing applications. Emitter is an open source MQTT routing application written in the Go programming language. It uses the mesh library by Weaveworks to implement a highly available and partition tolerant routing application for the internet of things. MQTT is a protocol for the publish and subscribe messaging pattern which is heavily used in the internet of things. Emitter uses similar technologies to Bondy and can be used for performance comparisons when investigating publish and subscribe functionalities.

## State of a Router

In a setup where a WAMP router is distributed over multiple machines, the routing information for messages has to synchronized between the router replicas. The routing information for a WAMP router consists of the following parts:

### Subscriptions

In order for a router replica to decide which client is interested in a published topic, the router needs to synchronize the topic subscriptions for each client over all replicas.

### Registrations

When a client connected to the WAMP router initiates a remote procedure call (RPC), the router replicas must know which client implements the called procedure to route the RPC to the corresponding client. This information is stored in registrations. If a client implements a procedure that can be called remotely, the client registers this procedure in the router.

### Transport Information

As not all clients of a router are connected to the same replica, the replicas must know which replica is connected with which client. This information is used by the router to forward messages to the correct replica, so that a message reaches the desired client.

## Data Transport

Besides the state needed for the routing there is other data that must be transferred between router replicas. Publications and procedure calls contain a message body in which parameters and payloads are stored. When forwarding a publication or procedure call to another client, this data must be potentially transferred to another replica. The frequency and size of a topic publication payload can get quite high. Therefore it is undesirable to initiate a state change for publications and RPCs. Instead of routing every publications and RPC over the leader of the cluster, the payload can be transferred directly between the replicas that manage affected clients. This is possible as neither publications nor RPCs contain information that is relevant for the routing.

When clients are connecting to a router, the clients location in the cluster must be synchronized to other replicas. Most clients will then start registering procedures in the router and subscribe for topics. Although it is possible to register and subscribe procedures any time during an active connection to the router, the majority of messages produced by a client after its initial setup are publications and procedure calls. Therefore state changes are far less frequent when not including publications and procedure calls in the router state.

Distributed filesystems are not well suited to synchronize routing information. The information that is needed for routing is of small size, where distributed filesystems are designed to synchronize huge amounts of data. But more importantly, the routing application would get considerably harder to deploy as for every instance of the WAMP router a distributed filesystem must be set up. This increases the administration overhead and complexity of the deployment. The same applies to distributed databases, where a distributed database instance must be set up for every instance of a new WAMP router. Additionally, in order to avoid publications and procedure calls to be part of the router state, an additional communication channel must be established between the routers. This increases the complexity when connecting replicas of a router with each other as database connections and peer-to-peer router connections must be managed by the application.

Therefore, it was decided to use a consensus algorithm for synchronizing the routing state between replicas. As consensus algorithms do not specify how the transport channel for communication between replicas should look like, a forwarding channel for publications and procedure calls can be included in the replica interconnect.

## Consensus Algorithms

There exist two major consensus algorithms: Paxos and Raft. In general, raft is considered easier to understand and provides a more general solution for state synchronization. As the goal of this paper is not to implement one of these consensus algorithms but rather use one of them to implement a distributed WAMP routing application, Raft was selected as there already exists an implementation for the Rust programming language called `raft-rs`. The `raft-rs` library is also used in TiKV and TiDB which are part of the Cloud Native Computing Foundation (CNCF). The `raft-rs` library is maintained and developed by Pingcap who also own TiKV and TiDB. This leads to the decision to use `raft-rs` for state synchronization between WAMP router replicas.

# Implementing a WAMP-Router

 * raft-rs library from pingcap used
 * raft paper was of great help
 * initializing a cluster
    * not well covered in the paper

## Connection Management

 * `ConnectionManager`
     * establishing connections
 * `Transport`
     * used for communication between the nodes
     * inmemory-channel transport
     * TCP transport

## State Management

 * `Machine`
    * handler object to easily change the state of the node
 * `MachineCore`
    * writes the state to a storage
 * Experiment
    * a declarative state machine using rust's procedural macros

## Storing State

 * `Storage`
    * manages the raft-log
    * appending and reading of the state changes
 * Storage implementations
    * txfs (linux kernel module)
    * zboxfs (userland filesystem)
       * found some bugs and was not stable yet
    * for now the storage is inmemory only
       * is not critical as router state can be restored simply by reconnecting all the clients

## Running a Node

 * `Node`
    * manages all the above components in a single interface
       * `Machine`
       * `ConnectionManager`
       * `Storage`
    * completely thread safe

## Implementing the Protocol

 * forked wampire
 * removed RPCs
 * state of pub/sub synchronized with simple-raft-node

# Deployment

The network setup for `autobahnkreuz` is more complex than other single-node router network setups. To reduce the network administration tasks when deploying an instance of Autobahnkreuz, a Kubernetes deployment was implemented. Kubernetes provides a declarative language for network and configuration setups of docker containers. By using Kubernetes for the network setup, the deployment gets reproducible and scalable. Docker containers are used to isolate the application components from the host operating system. Each docker container has its own root filesystem with its own GNU/Linux distribution. Containers only share the operating system kernel with the host system and other containers. To make communication with other containers possible, filesystem entries and network ports can be exposed by a container. For Autobahnkreuz only two TCP ports are exposed.

A process from within a Docker container cannot access data outside the container, unless granted by the administrator. By removing standard GNU/Linux utilities from a container, the attack surface of the deployment gets reduced. This includes removing shells, coreutils, and any other program or library that is not needed to run Autobahnkreuz. This results in a container with some shared libraries and a single executable. The attack surface can be further reduced by statically linking the executable, removing shared libraries like the glibc from the container. Now, the container only contains a single executable file. This reduces the possibility of an attacker using preinstalled components in the container to execute scripts or other malicious code. Although this does not eliminate executing malicious code in the container completely, it makes it harder for an attacker to get code running in the container.

In order to connect all router replicas with each other, the leader tells all other replicas behind which domain or IP each replica is running. Kubernetes uses a domain name service (DNS) to resolve domains inside the cluster for each replica. Additionally, when launching a new replica, these domain names can be used to initiate an initial connection with the cluster. However, during the development of the Kubernetes deployment, a bug was found in the DNS of Kubernetes (coredns). The bug is appearing within the first 30 seconds after startup of a replica. During these 30 seconds, new domain names will sometimes result in `NXDOMAIN` or `REFUSED`. This leads to an unstable startup of new replicas. The bug is reported upstream and confirmed. Autobahnkreuz resolves this issue by issuing DNS lookups until the lookup succeeds.

# Evaluation

The availability scenario runs a router with 5 replicas (if horizontal scaling is supported) where 10 clients (nodejs implementation) try to get a connection every second. The router instances are than randomly killed every 30 seconds. The autobahnkreuz router crashes after 10 seconds in the scenario as new members in the routing cluster are accepting connections while not synchronized to the cluster which destabilizes the cluster. The autobahnkreuz implementation fails to provide the expected availability!

![availability](../scenarios/availability/plots/2019-06-16T18:35:30+02:00-scenario-availability.png)

The container size scenario checks the size of the latest docker container that is provided by upstream. The lower the container size, the easier the deployment within a cluster orchestrator like kubernetes is (lower than 100 MiB is sufficient for fast deployment).

![container size](../scenarios/container-size/plots/2019-06-16T17:58:45+02:00-scenario-pod-size.png)

The high load scenario lets 10 clients publish topics to the other clients as fast as they can. The latency until a topic is signaled as published by the router is messured over time.

![high-load](../scenarios/high-load/plots/2019-06-17T14:19:34+02:00-scenario-high-load.png)

The ram usage scenario messures how much memory is consumed by all processes that belong to the routing application while 10 clients are sending a publication every 100 milliseconds.

![ram-usage](../scenarios/ram-usage/plots/2019-06-17T12:09:43+02:00-scenario-ram-usage.png)

The scaling-out scenario increases the router instances by one and the client instances by two every minute and messures the overall message throughput per client. The scenario is currently run on a single machine while a more realistic scenario would be to also increase the number of machine with the replica count.

![scaling-out](../scenarios/scaling-out/plots/2019-06-17T15:30:39+02:00-scenario-scaling-out.png)

# Conclusion

 * safe async APIs are hard!

# Future Work

 * web-assembly API for router plugins
    * current WAMP-router implementations suffer from too many features
    * error rate rises

# References

