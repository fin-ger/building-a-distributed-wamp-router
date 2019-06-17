# Introduction

## Web-Application-Messaging-Protocol (WAMP)

The Web-Application-Messaging-Protocol (WAMP) is a web-socket subprotocol built on top of modern web technologies. It implements a publish and subscribe messaging pattern as well as routed remote procedure calls (RPCs). This enables application developers to use a unified interconnect between application components for two different messaging patterns. The protocol is often used in micro-service environments where one application is a minimalistic service for a single responsibility. A distributed application can be created by interconnecting the micro-services. By building on top of web-sockets this enabled web pages inside the web browser to participate as part of the micro-service infrastructure. This makes it considerably easier for a web-page to communicate with the backend in realtime.

# Existing solutions

Comparison to existing solutions.

 * emitter
 * distributed databases
 * distributed filesystems
 * crossbar.io FX enterprise
 * bondy
    * eventual consistency

# Sharing State

 * 3 possibilities
    * distributed database
    * distributed filesystem
    * consensus algorithms

## State of a Router

 * WAMP-Sessions
    * registrations
    * subscriptions
    * transport information

## Data Transport

 * Persistent State
    * subscriptions
    * registrations
    * changes are less often (normally during initialization of a client)
    * must be known at all time on all routers
 * Messages
    * can be very large
    * can be very frequent
    * do not contain state relevant to the router
 * Transmitting messages
    * databases and filesystems
       * state must be changed every time
       * alternative: additional connection between routers
    * consensus algorithms do not specify a transport channel

## Consensus Algorithms

 * raft
    * already implemented in rust
    * easy to understand
    * solves some connection management problems
 * paxos
    * harder to understand
    * not implemented in rust

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

# Evaluation

![availability](../scenarios/availability/plots/2019-06-16T18:35:30+02:00-scenario-availability.png)
![container size](../scenarios/container-size/plots/2019-06-16T17:58:45+02:00-scenario-pod-size.png)
![high-load](../scenarios/high-load/plots/2019-06-17T14:19:34+02:00-scenario-high-load.png)
![ram-usage](../scenarios/ram-usage/plots/2019-06-17T12:09:43+02:00-scenario-ram-usage.png)
![scaling-out](../scenarios/scaling-out/plots/2019-06-17T15:30:39+02:00-scenario-scaling-out.png)

# Conclusion

 * safe async APIs are hard!

# Future Work

 * web-assembly API for router plugins
    * current WAMP-router implementations suffer from too many features
    * error rate rises

# References

