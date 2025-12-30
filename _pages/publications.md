---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

<style>
  .publications-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .pub-header {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .pub-links {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .pub-links a {
    color: #2563eb;
    text-decoration: none;
  }
  
  .pub-links a:hover {
    text-decoration: underline;
  }
  
  .pub-note {
    font-size: 0.8rem;
    color: #999;
    font-style: italic;
  }
  
  .filter-section {
    margin-bottom: 3rem;
  }
  
  .filter-label {
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #999;
    margin-bottom: 1rem;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem 2rem;
  }
  
  .filter-btn {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.25rem 0;
    font-size: 0.95rem;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-btn:hover {
    color: #000;
    border-bottom-color: #999;
  }
  
  .filter-btn.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
    font-weight: bold;
  }
  
  .clear-btn {
    background: none;
    border: none;
    font-size: 0.8rem;
    color: #ef4444;
    font-style: italic;
    cursor: pointer;
    margin-left: 0.5rem;
  }
  
  .publications-list {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  
  .publication {
    transition: opacity 0.3s;
  }
  
  .publication.hidden {
    display: none;
  }
  
  .pub-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  
  .pub-authors {
    font-size: 1rem;
    color: #444;
    margin-bottom: 0.25rem;
  }
  
  .pub-author-highlight {
    font-weight: bold;
    color: #000;
  }
  
  .pub-venue {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
    margin-bottom: 0.75rem;
  }
  
  .pub-venue strong {
    font-weight: bold;
    color: #000;
  }
  
  .pub-paper-links {
    display: flex;
    gap: 1rem;
  }
  
  .pub-paper-links a {
    font-size: 0.75rem;
    font-weight: bold;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-decoration: none;
  }
  
  .pub-paper-links a:hover {
    text-decoration: underline;
  }
</style>

<div class="publications-container">
  <header class="pub-header">
    <div class="pub-links">
      You can also find my publications on 
      <a href="https://scholar.google.com/citations?user=Fxm2RTUAAAAJ" target="_blank">Google Scholar</a> 
      and 
      <a href="https://dblp.org/pid/148/1500.html" target="_blank">dblp</a>
    </div>
    <div class="pub-note">
      <sup>*</sup> denotes shared first authorship
    </div>
  </header>

  <section class="filter-section">
    <div class="filter-label">Filter by Theme:</div>
    <div class="filter-buttons" id="filterButtons"></div>
  </section>

  <div class="publications-list" id="publicationsList"></div>
</div>

<script>
var pubData = [
  {id: 1, title: "CacheGuardian: A Timing Side-Channel Resilient LLC Design.", authors: ["Ziang Zhou", "Qi Zhu", "Hao Lan", "Huifeng Zhu", "Wei Yan", "Chenglu Jin", "Xuejun An", "Xiaochun Ye"], venue: "International Conference on Computer-Aided Design (ICCAD'25)", year: 2025, tags: ["Hardware Security", "Architecture"], links: {}},
  {id: 2, title: "Ransomware Negotiation: Dynamics and Privacy-Preserving Mechanism Design", authors: ["Haohui Zhang", "Sirui Shen", "Xinyu Hu", "Chenglu Jin"], venue: "Conference on Game Theory and AI for Security (GameSec'25)", year: 2025, tags: ["Privacy", "Security", "Game Theory"], links: {Paper: "https://link.springer.com/chapter/10.1007/978-3-032-08064-6_12", Artifact: "https://github.com/NomadShen/TinyGarble2.0", "Online Archive": "https://arxiv.org/abs/2508.15844"}},
  {id: 3, title: "Breaking XOR Arbiter PUFs with Chosen Challenge Attack", authors: ["Niloufar Sayadi", "Phuong Ha Nguyen", "Marten van Dijk", "Chenglu Jin"], venue: "IEEE Transactions on Information Forensics and Security (TIFS'25)", year: 2025, tags: ["Hardware Security", "PUF", "Cryptography"], links: {Paper: "https://ieeexplore.ieee.org/abstract/document/10982292/", Artifact: "https://github.com/niloufarsyd/Chosen_Challenge_Attack", "Online Archive": "https://ir.cwi.nl/pub/35170"}},
  {id: 4, title: "Making Deals with the Devils: the Art of Negotiation after Ransomware Attacks", authors: ["Haohui Zhang", "Xinyu Hu", "Chenglu Jin"], venue: "International Workshop on Security Protocols (SPW'25)", year: 2025, tags: ["Security", "Negotiation"], links: {}},
  {id: 5, title: "Reading It Like an Open Book: Single-trace Blind Side-channel Attacks on Garbled Circuit Frameworks", authors: ["Sirui Shen", "Chenglu Jin"], venue: "Annual Computer Security Applications Conference (ACSAC'24)", year: 2024, tags: ["Hardware Security", "Cryptography", "Side-channel"], links: {Paper: "https://ieeexplore.ieee.org/document/10917952", Artifact1: "https://github.com/NomadShen/chipwhisperer", Artifact2: "https://github.com/NomadShen/fpga_based_attack", Artifact3: "https://doi.org/10.6084/m9.figshare.27284547.v1", "Online Archive": "https://ir.cwi.nl/pub/35168"}},
  {id: 6, title: "PG: Byzantine Fault-Tolerant and Privacy-Preserving Sensor Fusion with Guaranteed Output Delivery", authors: ["Chenglu Jin*", "Chao Yin*", "Marten van Dijk", "Sisi Duan", "Fabio Massacci", "Michael K. Reiter", "Haibin Zhang"], venue: "ACM Conference on Computer and Communications Security (CCS'24)", year: 2024, tags: ["Privacy", "Cyber-Physical Systems", "Security"], links: {Paper: "https://dl.acm.org/doi/abs/10.1145/3658644.3670343", Artifact: "https://figshare.com/articles/software/PG_source_code/25669026", "Online Archive": "https://ir.cwi.nl/pub/34722", Slides1: "../files/PG_CCS.pdf", Slides2: "../files/PG.pdf"}},
  {id: 7, title: "Dynamic Group Time-based One-time Passwords", authors: ["Xuelian Cao", "Zheng Yang", "Jianting Ning", "Chenglu Jin", "Rongxing Lu", "Zhiming Liu", "Jianying Zhou"], venue: "IEEE Transactions on Information Forensics and Security (TIFS'24)", year: 2024, tags: ["Cryptography", "Security"], links: {Paper: "https://ieeexplore.ieee.org/document/10494770", "Online Archive": "https://ir.cwi.nl/pub/34124"}},
  {id: 8, title: "Masked Memory Primitive for Key Insulated Schemes", authors: ["Zachary DiMeglio", "Jenna Bustami", "Deniz Gurevin", "Chenglu Jin", "Marten van Dijk", "Omer Khan"], venue: "IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'24)", year: 2024, tags: ["Hardware Security", "Cryptography"], links: {Paper: "https://ieeexplore.ieee.org/abstract/document/10545375", "Online Archive": "https://ir.cwi.nl/pub/34270"}},
  {id: 9, title: "Privacy and Integrity Protection for IoT Multimodal Data using Machine Learning and Blockchain", authors: ["Qingzhi Liu", "Yuchen Huang", "Chenglu Jin", "Xiaohan Zhou", "Ying Mao", "Cagatay Catal", "Long Cheng"], venue: "ACM Transactions on Multimedia Computing Communications and Applications (TOMM'23)", year: 2023, tags: ["Hardware Security", "Cryptography"], links: {Paper: "https://dl.acm.org/doi/10.1145/3638769", "Online Archive": "https://ir.cwi.nl/pub/34794"}},
  {id: 10, title: "Optimizing Proof of Aliveness in Cyber-Physical Systems", authors: ["Zheng Yang*", "Chenglu Jin*", "Xuelian Cao", "Marten van Dijk", "Jianying Zhou"], venue: "IEEE Transactions on Dependable and Secure Computing (TDSC'23)", year: 2023, tags: ["Cyber-Physical Systems", "Security"], links: {Paper: "https://ieeexplore.ieee.org/abstract/document/10324378", "Online Archive": "https://ir.cwi.nl/pub/33586", Slides: "../files/PoA_RICSS2024.pdf"}},
  {id: 11, title: "Secure Remote Attestation with Strong Key Insulation Guarantees", authors: ["Deniz Gurevin", "Chenglu Jin", "Phuong Ha Nguyen", "Omer Khan", "Marten van Dijk"], venue: "IEEE Transactions on Computers (TC'23)", year: 2023, tags: ["Hardware Security", "Cryptography"], links: {Paper: "https://ieeexplore.ieee.org/document/10168259", "Online Archive": "https://ir.cwi.nl/pub/33247"}},
  {id: 12, title: "A Theoretical Framework for the Analysis of Physical Unclonable Function Interfaces and its Relation to the Random Oracle Model", authors: ["Marten van Dijk", "Chenglu Jin"], venue: "Journal of Cryptology (JoC'23)", year: 2023, tags: ["PUF", "Cryptography"], links: {Paper: "https://link.springer.com/article/10.1007/s00145-023-09475-1"}},
  {id: 13, title: "HMACCE: Establishing Authenticated and Confidential Channel From Historical Data for Industrial Internet of Things", authors: ["Chenglu Jin*", "Zheng Yang*", "Tao Xiang", "Sridhar Adepu", "Jianying Zhou"], venue: "IEEE Transactions on Information Forensics and Security (TIFS'23)", year: 2023, tags: ["IoT", "Security", "Cryptography"], links: {Paper: "https://ieeexplore.ieee.org/document/10007864", "Online Archive": "https://ir.cwi.nl/pub/31499"}},
  {id: 14, title: "Programmable Access-Controlled and Generic Erasable PUF Design and Its Applications", authors: ["Chenglu Jin", "Wayne Burleson", "Marten van Dijk", "Ulrich Rührmair"], venue: "Journal of Cryptographic Engineering (JCEN'22)", year: 2022, tags: ["PUF", "Hardware Security", "Cryptography"], links: {Paper: "https://link.springer.com/article/10.1007/s13389-022-00284-z", "Online Archive": "https://ir.cwi.nl/pub/31493/"}},
  {id: 15, title: "Group Time-based One-time Passwords and its Application to Efficient Privacy-Preserving Proof of Location", authors: ["Zheng Yang", "Chenglu Jin", "Jianting Ning", "Zengpeng Li", "Tien Tuan Anh Dinh", "Jianying Zhou"], venue: "Annual Computer Security Applications Conference (ACSAC'21)", year: 2021, tags: ["Cryptography", "Privacy", "Security"], links: {Paper: "https://dl.acm.org/doi/10.1145/3485832.3488009", "Online Archive": "https://ir.cwi.nl/pub/31289", Slides: "../files/GTOTP_ACSAC.pdf"}},
  {id: 16, title: "PLCrypto: A Symmetric Cryptographic Library for Programmable Logic Controllers", authors: ["Zheng Yang", "Zhiting Bao", "Chenglu Jin", "Zhe Liu", "Jianying Zhou"], venue: "IACR Transactions on Symmetric Cryptology (ToSC'21)", year: 2021, tags: ["Cryptography", "Cyber-Physical Systems"], links: {Paper: "https://tosc.iacr.org/index.php/ToSC/article/view/9178", Artifact: "https://github.com/PLCrypto/PLCrypto"}},
  {id: 17, title: "HACK3D: Crowdsourcing the Assessment of Cybersecurity in Digital Manufacturing", authors: ["Michael Linares*", "Nishant Aswani*", "Gary Mac", "Chenglu Jin", "Fei Chen", "Nikhil Gupta", "Ramesh Karri"], venue: "IEEE Computer'21", year: 2021, tags: ["Security"], links: {Paper: "https://ieeexplore.ieee.org/abstract/document/9585150", "Online Archive": "https://ir.cwi.nl/pub/31211"}},
  {id: 18, title: "Lightweight Delegated Authentication with Identity Fraud Detection for Cyber-physical Systems", authors: ["Zheng Yang", "Chao Yin", "Chenglu Jin", "Jianting Ning", "Jianying Zhou"], venue: "ACM Cyber-Physical System Security Workshop (CPSS@AsiaCCS'21)", year: 2021, tags: ["Cyber-Physical Systems", "Security"], links: {Paper: "https://dl.acm.org/doi/abs/10.1145/3457339.3457984", "Online Archive": "https://ir.cwi.nl/pub/30891"}},
  {id: 19, title: "A Survey of Cybersecurity of Digital Manufacturing", authors: ["Priyanka Mahesh", "Akash Tiwari", "Chenglu Jin", "Panganamala R. Kumar", "A. L. Narasimha Reddy", "Satish T.S. Bukkapatanam", "Nikhil Gupta", "Ramesh Karri"], venue: "Proceedings of the IEEE (PIEEE'21)", year: 2021, tags: ["Security"], links: {Paper: "https://ieeexplore.ieee.org/document/9247392", Presentation: "https://www.youtube.com/watch?v=1KQmPjAGaEM"}},
  {id: 20, title: "Erasable PUFs: Formal Treatment and Generic Design", authors: ["Chenglu Jin", "Wayne Burleson", "Marten van Dijk", "Ulrich Rührmair"], venue: "Workshop on Attacks and Solutions in Hardware Security (ASHES@CCS'20)", year: 2020, tags: ["PUF", "Hardware Security", "Cryptography"], links: {Paper: "https://dl.acm.org/doi/10.1145/3411504.3421215", "Online Archive": "https://ir.cwi.nl/pub/30393", Slides: "../files/Erasable_PUF_ASHES.pdf"}},
  {id: 21, title: "LiS: Lightweight Signature Schemes for Continuous Message Authentication in Cyber-Physical Systems", authors: ["Zheng Yang", "Chenglu Jin", "Yangguang Tian", "Junyu Lai", "Jianying Zhou"], venue: "ACM Asia Conference on Computer and Communications Security (AsiaCCS'20)", year: 2020, tags: ["Cryptography", "Cyber-Physical Systems", "Security"], links: {Paper: "https://dl.acm.org/doi/abs/10.1145/3320269.3372195", Presentation: "https://dl.acm.org/doi/abs/10.1145/3320269.3372195"}},
  {id: 22, title: "Proof of Aliveness", authors: ["Chenglu Jin*", "Zheng Yang*", "Marten van Dijk", "Jianying Zhou"], venue: "Annual Computer Security Applications Conference (ACSAC'19)", year: 2019, tags: ["Cyber-Physical Systems", "Security"], links: {Paper: "https://dl.acm.org/citation.cfm?id=3359827", Artifact: "https://github.com/ChengluJin/Proof_of_Aliveness", Slides: "https://www.acsac.org/2019/program/final/1/174.pdf"}},
  {id: 23, title: "The Interpose PUF: Secure PUF Design against State-of-the-art Machine Learning Attacks", authors: ["Phuong Ha Nguyen", "Durga Prasad Sahoo", "Chenglu Jin", "Kaleel Mahmood", "Ulrich Rührmair", "Marten van Dijk"], venue: "IACR Transactions on Cryptographic Hardware and Embedded Systems (TCHES'19)", year: 2019, tags: ["PUF", "Hardware Security", "Cryptography"], links: {Paper: "https://tches.iacr.org/index.php/TCHES/article/view/8351", Artifact: "https://github.com/scluconn/DA_PUF_Library", Presentation: "https://www.youtube.com/watch?v=m0cvYXamZlg", Tutorial: "https://www.youtube.com/watch?v=kBpQL3_7KJA&list=PLK5NNs4GceLQw7bOEHSdZOwHlmSF1zvSW"}},
  {id: 24, title: "Exploiting Lithography Limits for Hardware Security Applications", authors: ["Raihan Sayeed Khan", "Nafisa Noor", "Chenglu Jin", "Sadid Muneer", "Faruk Dirisaglik", "Adam Cywar", "Phuong Ha Nguyen", "Marten van Dijk", "Ali Gokirmak", "Helena Silva"], venue: "IEEE Conference on Nanotechnology (IEEE-NANO'19)", year: 2019, tags: ["Hardware Security"], links: {Paper: "https://ieeexplore.ieee.org/abstract/document/8993902", "Online Archive": "https://par.nsf.gov/servlets/purl/10198072"}},
  {id: 25, title: "Secure and Efficient Initialization and Authentication Protocols for SHIELD", authors: ["Chenglu Jin", "Marten van Dijk"], venue: "IEEE Transactions on Dependable and Secure Computing (TDSC'19)", year: 2019, tags: ["Hardware Security", "Cryptography"], links: {Paper: "http://ieeexplore.ieee.org/document/7807281", "Online Archive": "https://eprint.iacr.org/2015/210", Slides: "../files/SHIELD.pdf"}},
  {id: 26, title: "Advancing the State-of-the-Art in Hardware Trojans Detection", authors: ["Syed Kamran Haider", "Chenglu Jin", "Masab Ahmad", "Devu Manikantan Shila", "Omer Khan", "Marten van Dijk"], venue: "IEEE Transactions on Dependable and Secure Computing (TDSC'19)", year: 2019, tags: ["Hardware Security"], links: {Paper: "http://ieeexplore.ieee.org/document/7820150", "Online Archive": "https://eprint.iacr.org/2014/943", Presentation: "https://www.youtube.com/watch?v=KXxbifX01jw"}},
  {id: 27, title: "Snapshotter: Lightweight Intrusion Detection and Prevention System for Industrial Control Systems", authors: ["Chenglu Jin", "Saeed Valizadeh", "Marten van Dijk"], venue: "IEEE International Conference on Industrial Cyber-Physical Systems (ICPS'18)", year: 2018, tags: ["Cyber-Physical Systems", "Security"], links: {Paper: "https://ieeexplore.ieee.org/document/8390813", Slides: "../files/Snapshotter.pdf"}},
  {id: 28, title: "Weak-Unforgeable Tags for Secure Supply Chain Management", authors: ["Marten van Dijk", "Chenglu Jin", "Hoda Maleki", "Phuong Ha Nguyen", "Reza Rahaeimehr"], venue: "International Conference on Financial Cryptography and Data Security (FC'18)", year: 2018, tags: ["Cryptography", "Security"], links: {Paper: "https://link.springer.com/chapter/10.1007/978-3-662-58387-6_5", "Full Version": "https://eprint.iacr.org/2017/1221.pdf"}},
  {id: 29, title: "FPGA Implementation of a Cryptographically-Secure PUF based on Learning Parity with Noise", authors: ["Chenglu Jin", "Charles Herder", "Ling Ren", "Phuong Ha Nguyen", "Benjamin Fuller", "Srinivas Devadas", "Marten van Dijk"], venue: "Cryptography'17", year: 2017, tags: ["PUF", "Hardware Security", "Cryptography"], links: {Paper: "http://www.mdpi.com/2410-387X/1/3/23", Artifact: "https://github.com/scluconn/LPN-based_PUF"}},
  {id: 30, title: "Phase Calibrated Ring Oscillator PUF Design and Implementation on FPGAs", authors: ["Wei Yan", "Chenglu Jin", "Fatemeh Tehranipoor", "John A. Chandy"], venue: "International Conference on Field-Programmable Logic and Applications (FPL'17)", year: 2017, tags: ["PUF", "Hardware Security"], links: {Paper: "https://ieeexplore.ieee.org/document/8056859", "Online Archive": "https://www.researchgate.net/publication/320250281_Phase_calibrated_ring_oscillator_PUF_design_and_implementation_on_FPGAs"}},
  {id: 31, title: "Advancing the State-of-the-Art in Hardware Trojans Design", authors: ["Syed Kamran Haider", "Chenglu Jin", "Marten van Dijk"], venue: "IEEE International Midwest Symposium on Circuits and Systems (MWSCAS'17)", year: 2017, tags: ["Hardware Security"], links: {Paper: "https://ieeexplore.ieee.org/document/8053050", "Full Version": "http://arxiv.org/abs/1605.08413"}},
  {id: 32, title: "New Clone-Detection Approach for RFID-Based Supply Chains", authors: ["Hoda Maleki", "Reza Rahaeimehr", "Chenglu Jin", "Marten van Dijk"], venue: "IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'17)", year: 2017, tags: ["Hardware Security", "Cryptography"], links: {Paper: "https://ieeexplore.ieee.org/document/7951810"}},
  {id: 33, title: "Mitigating Synchronized Hardware Trojan Attacks in Smart Grids", authors: ["Chenglu Jin", "Lingyu Ren", "Xubin Liu", "Peng Zhang", "Marten van Dijk"], venue: "Workshop on Cyber-Physical Security and Resilience in Smart Grids (CPSR-SG@CPSWeek'17)", year: 2017, tags: ["Hardware Security", "Cyber-Physical Systems"], links: {Paper: "http://dl.acm.org/citation.cfm?id=3055394", "Online Archive": "https://par.nsf.gov/servlets/purl/10049484", Slides: "../files/SHT_CPSRSG.pdf"}},
  {id: 34, title: "Can Algorithm Diversity in Stream Cipher Implementation Thwart (Natural and) Malicious Faults?", authors: ["Xiaofei Guo", "Chenglu Jin", "Chi Zhang", "Athanasios Papadimitriou", "David Hély", "Ramesh Karri"], venue: "IEEE Transactions on Emerging Topics in Computing (TETC'16)", year: 2016, tags: ["Cryptography", "Hardware Security"], links: {Paper: "http://ieeexplore.ieee.org/document/7110553"}},
  {id: 35, title: "Simulation and Analysis of Negative-Bias Temperature Instability Aging on Power Analysis Attacks", authors: ["Xiaofei Guo", "Naghmeh Karimi", "Francesco Regazzoni", "Chenglu Jin", "Ramesh Karri"], venue: "IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'15)", year: 2015, tags: ["Hardware Security", "Side-channel"], links: {Paper: "https://ieeexplore.ieee.org/document/7140250", "Online Archive": "https://www.researchgate.net/publication/283229984_Simulation_and_analysis_of_negative-bias_temperature_instability_aging_on_power_analysis_attacks"}},
  {id: 36, title: "Security Analysis of Concurrent Error Detection against Differential Fault Analysis", authors: ["Xiaofei Guo", "Debdeep Mukhopadhyay", "Chenglu Jin", "Ramesh Karri"], venue: "Journal of Cryptographic Engineering (JCEN'15)", year: 2015, tags: ["Cryptography", "Hardware Security"], links: {Paper: "http://link.springer.com/article/10.1007/s13389-014-0092-8"}},
  {id: 37, title: "NREPO: Normal Basis Recomputing with Permuted Operands", authors: ["Xiaofei Guo", "Debdeep Mukhopadhyay", "Chenglu Jin", "Ramesh Karri"], venue: "IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'14)", year: 2014, tags: ["Cryptography", "Hardware Security"], links: {Paper: "https://ieeexplore.ieee.org/document/6855581", "Online Archive": "https://eprint.iacr.org/2014/497"}}
];

var allTags = [];
var selTags = [];

for (var i = 0; i < pubData.length; i++) {
  for (var j = 0; j < pubData[i].tags.length; j++) {
    if (allTags.indexOf(pubData[i].tags[j]) === -1) allTags.push(pubData[i].tags[j]);
  }
}
allTags.sort();

function fmtVenue(v) {
  return v.replace(/(\(.*?\))/g, '<strong>$1</strong>');
}

function drawFilters() {
  var c = document.getElementById('filterButtons');
  var h = '';
  for (var i = 0; i < allTags.length; i++) {
    h += '<button class="filter-btn" data-tag="' + allTags[i] + '">' + allTags[i] + '</button>';
  }
  h += '<button class="clear-btn" id="clearBtn" style="display:none">[Clear]</button>';
  c.innerHTML = h;
  var btns = c.querySelectorAll('.filter-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function() { togTag(this.getAttribute('data-tag')); };
  }
  document.getElementById('clearBtn').onclick = function() { selTags = []; upd(); };
}

function togTag(t) {
  var idx = selTags.indexOf(t);
  if (idx > -1) selTags.splice(idx, 1);
  else selTags.push(t);
  upd();
}

function upd() {
  var btns = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < btns.length; i++) {
    if (selTags.indexOf(btns[i].getAttribute('data-tag')) > -1) btns[i].classList.add('active');
    else btns[i].classList.remove('active');
  }
  document.getElementById('clearBtn').style.display = selTags.length > 0 ? 'inline-block' : 'none';
  var filt = selTags.length === 0 ? pubData : pubData.filter(function(p) {
    for (var i = 0; i < selTags.length; i++) {
      if (p.tags.indexOf(selTags[i]) > -1) return true;
    }
    return false;
  });
  drawPubs(filt);
}

function drawPubs(pubs) {
  var c = document.getElementById('publicationsList');
  var h = '';
  for (var i = 0; i < pubs.length; i++) {
    var p = pubs[i];
    h += '<div class="publication"><h3 class="pub-title">' + p.title + '</h3><div class="pub-authors">';
    for (var j = 0; j < p.authors.length; j++) {
      var a = p.authors[j];
      h += a.indexOf("Chenglu Jin") > -1 ? '<span class="pub-author-highlight">' + a + '</span>' : a;
      if (j < p.authors.length - 1) h += ', ';
    }
    h += '</div><div class="pub-venue">' + fmtVenue(p.venue) + ', ' + p.year + '</div><div class="pub-paper-links">';
    for (var k in p.links) {
      if (p.links.hasOwnProperty(k)) h += '<a href="' + p.links[k] + '" target="_blank">[' + k + ']</a>';
    }
    h += '</div></div>';
  }
  c.innerHTML = h;
}

function go() {
  if (document.getElementById('filterButtons') && document.getElementById('publicationsList')) {
    drawFilters();
    drawPubs(pubData);
  } else {
    setTimeout(go, 50);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
else go();
</script>
