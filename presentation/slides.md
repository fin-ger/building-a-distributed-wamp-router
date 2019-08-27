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

<p><img src="res/what-is-wamp.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>,
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# II. Limitations of WAMP
## Centralized routing

<p><img src="res/centralized-routing.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>,
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# III. A Decentralized WAMP Router
## State of a WAMP Router

<p><img src="res/state-of-a-wamp-router.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>,
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# IV. Background
## Sharing State

<p><img src="res/sharing_state.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>,
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>,
  <a href="https://www.flaticon.com/authors/prettycons" title="prettycons">prettycons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# V. Solution Concept
## Replica Communication / Databases and Filesystems

<p><img src="res/sending_messages_1.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>,
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>,
  <a href="https://www.flaticon.com/authors/prettycons" title="prettycons">prettycons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# V. Solution Concept
## Replica Communication / Consensus Algorithm

<p><img src="res/sending_messages_2.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

---

# Implementing A Distributed WAMP-Router
## Developing the Autobahnkreuz WAMP-Router

<p><img src="res/autobahnkreuz.svg" height="240" style="box-shadow: none; border: none; background: none;"></p>

----

# VI. Implementing A Distributed WAMP-Router
## Connection Management

<p><img src="res/router_connections.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# VI. Implementing A Distributed WAMP-Router
## State Management

<p><img src="res/state_management.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# VI. Implementing A Distributed WAMP-Router
## Storing State

<p><img src="res/storage_management.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# VI. Implementing A Distributed WAMP-Router
## Running a Node

<p><img src="res/node.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

----

# VI. Implementing A Distributed WAMP-Router
## Implementing the Router

<p><img src="res/implementing-the-router.svg" height="730"></p>

<p><small>
  Icons made by
  <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  are licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small></p>

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

<p>
  <img style="margin: 0 4em;" src="res/graphs/container-size.png" height="375">
  <img style="margin: 0 4em;" src="res/graphs/ram-usage.png" height="375">
  <img style="margin: 0 4em;" src="res/graphs/high-load.png" height="375">
  <img style="margin: 0 4em;" src="res/graphs/scaling-out.png" height="375">
</p>

----

# Conclusion and Future Work

> TODO
