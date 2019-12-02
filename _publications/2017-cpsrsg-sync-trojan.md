---
title: "Mitigating Synchronized Hardware Trojan Attacks in Smart Grids"
collection: publications
permalink: /publication/2017-cpsrsg-sync-trojan
excerpt: 'This paper investigates how aging of the countermeasure to power side channel analysis will affect their effectiveness.'
date: 2017-04-01
venue: 'Workshop on Cyber-Physical Security and Resilience in Smart Grids (CPSR-SG@CPSWeek)'
citation: 'C. Jin, L. Ren, X. Liu, P. Zhang, and M. van Dijk. (2017). &quot;Mitigating Synchronized Hardware Trojan Attacks in Smart Grids&quot; <i>Workshop on Cyber-Physical Security and Resilience in Smart Grids (CPSR-SG@CPSWeek)</i>. '
---

<b>Abstract:</b> A hardware Trojan is a malicious circuit inserted into a device by a malicious designer or manufacturer in the circuit design or fabrication phase. With the globalization of semiconductor industry, more and more chips and devices are designed, integrated and fabricated by untrusted manufacturers, who can potentially insert hardware Trojans for launching attacks after the devices are deployed. Moreover, the most damaging attack in a smart grid is a large scale electricity failure, which can cause very serious consequences that are worse than any disaster. Unfortunately, this attack can be implemented very easily by synchronized hardware Trojans acting as a collective offline time bomb; the Trojans do not need to interact with one another and can affect a large fraction of nodes in a power grid. More sophisticatedly, this attack can also be realized by online hardware Trojans which keep listening to the communication channel and wait for a trigger event to trigger their malicious payloads; here, a broadcast message triggers all the Trojans at the same time.

In this paper, we address the offline synchronized hardware Trojan attack, as it does not require the adversary to penetrate the power grid network for sending triggers. We classify two types of offline synchronized hardware Trojan attacks as type A and B: type B requires communication between different nodes, and type A does not. The hardware Trojans needed for type B turn out to be much more complex (and therefore larger in area size) than those for type A. In order to prevent type A attacks we suggest to enforce each power grid node to work in an unique time domain which has a random time offset to Universal Coordinated Time (UTC). This isolation principle can mitigate type A offline synchronized hardware Trojan attacks in a smart grid, such that even if hardware Trojans are implanted in functional units, e.g. Phasor Measurement Units (PMUs) and Remote Terminal Units (RTUs), they can only cause a minimal damage, i.e. sporadic single node failures. The proposed solution only needs a trusted Global Positioning System (GPS) module which provides the correct UTC together with small additional interface circuitry. This means that our solution can be used to protect the current power grid infrastructure against type
A offline attacks without replacing any untrusted functional unit, which may already have embedded hardware Trojans.

[Download paper here](http://dl.acm.org/citation.cfm?id=3055394)
