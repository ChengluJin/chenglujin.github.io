---
title: "Secure and Efficient Initialization and Authenti-cation Protocols for SHIELD"
collection: publications
permalink: /publication/2017-cryptography-lpn-puf
excerpt: 'This paper discovers a security vunlerability in the SHIELD authentication protocol proposed by DARPA.' 
date: 2019-01-01
venue: 'IEEE Transactions on Dependable and Secure Computing (TDSC)'
citation: 'C. Jin, and M. van Dijk. (2019).&quot;
Secure and Efficient Initialization and Authenti-cation Protocols for SHIELD
&quot; <i>
IEEE Transactions on Dependable and Secure Computing (TDSC)
</i>. '
---

<b>Abstract:</b> With the globalization of semiconductor production, out-sourcing IC fabrication has become a trend in various aspects. This, however, introduces serious threats from the entire untrusted supply chain. To combat these threats, Defense Advanced Research Projects Agency (DARPA) proposed in 2014 the Supply Chain Hardware Integrity for Electronics Defense (SHIELD) program to design a secure hardware root-of-trust, called dielet, to be inserted into the host package of legitimately produced ICs. Dielets are RF powered and communicate with the outside world through their RF antennas. They have sensors which allow them to passively (without the need for power) record malicious events which can later be read out during an authentication protocol between the dielet and server with a smartphone as intermediary. This paper introduces a general framework for the initialization and authentication protocols in SHIELD with different adversarial models based on formally-defined security games. We introduce a “try-and-check” attack against DARPA’s example authentication protocol in their call for SHIELD proposals which nullifies the effectiveness of SHIELD’s main goal of being able to detect and trace adversarial activities with significant probability. We introduce the first concrete initialization protocol and, compared to DARPA’s example authentication protocol, introduce an improved authentication protocol which resists the try-and-check attack. The area overhead of our authentication and initialization protocols together is only 64-bit NVM, one 8-bit counter and a TRNG based on a single SRAM-cell together with corresponding control logic. Our findings and rigorous analysis are of utmost importance for the teams which received DARPA’s funding for implementing SHIELD.

[Download paper here](http://ieeexplore.ieee.org/document/7807281)