---
title: "Snapshotter: Lightweight Intrusion Detection and Prevention System for Industrial Control Systems"
collection: publications
permalink: /publication/2018-icps-snapshotter
excerpt: '>This paper introduces a secure logging system, Snapshotter, to monitor the behaviors of Programmable Logic Controllers (PLCs) in industrial control systems. Snapshotter can also guarantee the forward secrecy of the logged events and transmit them to a centralized server in a stealthy way for verification.' 
date: 2018-05-01
venue: 'IEEE International Conference on Industrial Cyber-Physical Systems (ICPS)'
citation: 'C. Jin, S. Valizadeh, and M. van Dijk. (2018). &quot;Snapshotter: Lightweight Intrusion Detection and Prevention System for Industrial Control Systems&quot; <i>IEEE International Conference on Industrial Cyber-Physical Systems (ICPS)</i>.'
---

<b>Abstract:</b> In recent years, security aspects of industrial control systems (ICS) have become a center of interest in cyberwarfare and engineering research, especially after the rise of advanced and sophisticated malware (e.g., Stuxnet) specifically designed to target such systems for different malicious purposes including industrial espionage, physical damage, financial gains, etc. Of special interest to us are programmable logic controllers
(PLC) which play a major role in ICS for process control purposes in different industries such as telecommunications, chemical processing, etc. A successful compromise of such controllers provides a malefic adversary the capability to inject arbitrary (malicious) code into the system in hopes of industrial process steering. Therefore, we investigate how a forward secure logging mechanism can be used for intrusion detection and prevention purposes in such cases. The proposed defense mechanism can be summarized in security-related information gathering and fast forward-secure logging by an intrusion detection agent, in addition to log analysis, incident identification and response by a trusted server. We implemented our proposal on the OpenPLC framework as the proof of concept and we show how our proposed scheme can be effective in order to detect and prevent adversaries from running arbitrary code on the controllers. The performance overhead we measured on our platform is at most 54 μs per scan cycle, which confirms how lightweight the presented solution is.

[Download paper here](https://ieeexplore.ieee.org/document/8390813)


---

Bibtex:

```
@inproceedings{jin2018snapshotter,
  title={Snapshotter: Lightweight intrusion detection and prevention system for industrial control systems},
  author={Jin, Chenglu and Valizadeh, Saeed and van Dijk, Marten},
  booktitle={2018 IEEE Industrial Cyber-Physical Systems (ICPS)},
  pages={824--829},
  year={2018},
  organization={IEEE}
}
```