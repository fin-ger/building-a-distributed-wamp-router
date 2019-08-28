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

<p><img src="res/test-setup.svg" height="670"></p>

<p style="line-height: 1"><small>
  Server icon made by
  <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
  from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
  is licensed by
  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
</small>
<br>
<small>
  Docker logo from dotCloud, Inc. is licensed by
  <a href="https://www.apache.org/licenses/LICENSE-2.0" title="Apache License 2.0">Apache License 2.0</a>
</small>
<br>
<small>
  Kubernetes logo made by
  <a href="https://www.linuxfoundation.org/trademark-usage/" title="The Linux Foundation">The Linux Foundation</a>
  from
  <a href="https://github.com/kubernetes/kubernetes" title="github.com">github.com</a>
  is licensed by
  <a href="http://creativecommons.org/licenses/by/4.0/" title="Creative Commons BY 4.0">CC 4.0 BY</a>
</small></p>

----

# VII. Validation
## Results / Resource Consumption

<p>
  <img style="margin: 2em 1em 0 0;" src="res/graphs/container-size.png" height="622">
  <img style="margin: 2em 0 0 0;" src="res/graphs/ram-usage.png" height="622">
</p>

----

# VII. Validation
## Results / Performance

<img style="margin: 1em 0 0 10em;" src="res/graphs/high-load.png" height="750">

----

# VIII. Validation
## Results / Scaling-Out

<img style="margin: 1em 0 0 10em;" src="res/graphs/scaling-out.png" height="750">

----

# Conclusion and Future Work

 - Implementing Remote-Procedure-Calls
 - Extract stable code into standalone libraries
 - Extended WAMP-Profile implementation via Router-Plugins
