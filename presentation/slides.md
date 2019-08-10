---
title: OVGU Theme Test
revealOptions:
  transition: slide
  transitionSpeed: fast
  width: 1920
  height: 1080
  margin: 0
  slideNumber: true
  hash: true
  history: true
---

# Prototyp eines verteilten Cloud-Native WAMP-Routers
## Wissenschaftliches Individualprojekt

<img src="res/wamp_logo.svg" height="230" style="box-shadow: none; border: none; background: none;">

<p><small>
  WAMP-Logo by
  <a href="http://crossbario.com/"
     title="Crossbar.io Technologies GmbH">Crossbar.io Technologies GmbH</a>
  is licensed under
  <a href="http://creativecommons.org/licenses/by-sa/3.0/"
     title="Creative Commons BY-SA 3.0">CC BY-SA 3.0</a>
</small></p>

----

# I. Introduction
## What is WAMP?

> TODO: Image with micro-services (frontend and backend) using WAMP

----

# II. Limitations of WAMP
## Centralized routing

> TODO: Image with a failing router and dead client connections

----

# III. A Decentralized WAMP Router
## State of a WAMP Router

1. Subscriptions
2. Registrations
3. Transport Information

> TODO: Put this into an image where a client is publishing topics and other clients are receiving it

----

# IV. Background
## Sharing State

> TODO: Add labels for Distributed Databases, Distributed Filesystems, and Consensus Algorithm

<p><img src="res/sharing_state.svg" height="750"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  and licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# V. Solution Concept
## Replica Communication

> TODO: insert image showing the complexity introduced with replica communication when not using a consensus algorithm

---

# Implementing A Distributed WAMP-Router
## Developing the Autobahnkreuz WAMP-Router

<p><img src="res/autobahnkreuz.svg" height="240" style="box-shadow: none; border: none; background: none;"></p>

----

# VI. Implementing A Distributed WAMP-Router
## Connection Management

> TODO: Add image

----

# VI. Implementing A Distributed WAMP-Router
## State Management

> TODO: Add image

----

# VI. Implementing A Distributed WAMP-Router
## Storing State

> TODO: Add image

----

# VI. Implementing A Distributed WAMP-Router
## Running a Node

> TODO: Add image

----

# VI. Implementing A Distributed WAMP-Router
## Implementing the Router

> TODO: Add image

---

# Validation
## Measuring the Performance of Autobahnkreuz

----

# VII. Validation
## Test Setup

> TODO: Add image

----

# VII. Validation
## Results

> TODO: Add graphs

----

# Conclusion and Future Work

> TODO
