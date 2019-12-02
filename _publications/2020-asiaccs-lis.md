---
title: "LiS: Lightweight Signature Schemes for Continuous Message Authentication in Cyber-Physical Systems"
collection: publications
permalink: /publication/2020-asiaccs-lis
excerpt: 'This paper introduces a super efficient signature scheme which allows a resource-constrained device to sign messages continously and efficiently.' 
date: 2020-07-01
venue: 'ACM Asia Conference on Computer and Communications Security (AsiaCCS)'
citation: 'Z. Yang, C. Jin, Y. Tian, J. Lai, J. Zhou. (2020).&quot;
LiS: Lightweight Signature Schemes for Continuous Message Authentication in Cyber-Physical Systems
&quot; <i>
ACM Asia Conference on Computer and Communications Security (AsiaCCS)
</i>. '
---

<b>Abstract:</b> Cyber-Physical Systems (CPS) provide the foundation of our critical infrastructures, which form the basis of emerging and future smart services and improve our quality of life in many areas. In such CPS, sensor data is transmitted over the network to the controller, which will make real-time control decisions according to the received sensor data. Due to the existence of spoofing attacks (more specifically to CPS, false data injection attacks), one has to protect the authenticity and integrity of the transmitted data. For example, a digital signature can be used to solve this issue. However, the resource-constrained field devices like sensors cannot afford conventional signature computation. Thus, we have to seek for an efficient signature mechanism that can support the fast and continuous message authentication in CPS, while being easy to compute on the devices.

To this end, we introduce two Lightweight Signature schemes (LiS), which are suitable for continuous message authentication commonly seen in cyber-physical systems. In our constructions, we exploit the efficient hash collision generation property of a chameleon hash function to transform a chameleon hash function into signature schemes. In our schemes, the signature of a message m is the randomness r associated with m in a chameleon hash function, such that they can lead to a hash collision with a given message randomness pair (m′, r ′). Thus, the task of a signer is to generate the collision using the private key of the underlying chameleon hash function, and a verifier can verify the signature by checking the hash collision with a known message and randomness
pair.

We also specifically instantiate the chameleon hash function in such a way that it leads to a fast signing procedure and an optimal storage requirement on the signer side. The optimized signing algorithms are very efficient. Namely, our first scheme requires only three additions and two multiplications, and only one additional hash is needed in the second scheme to resist adaptive chosen message attacks. In addition, the size of the signing key in our schemes is a small constant-sized bit string, which well fits CPS applications.


