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
    flex-wrap: wrap;
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
  
  .year-section {
    margin-bottom: 2rem;
  }
  
  .year-header {
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e5e5;
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
// Compact publication data
var d=[
{i:1,t:"CacheGuardian: A Timing Side-Channel Resilient LLC Design.",a:["Ziang Zhou","Qi Zhu","Hao Lan","Huifeng Zhu","Wei Yan","Chenglu Jin","Xuejun An","Xiaochun Ye"],v:"International Conference on Computer-Aided Design (ICCAD'25)",y:2025,g:["Hardware Security","Architecture"],l:{}},
{i:2,t:"Ransomware Negotiation: Dynamics and Privacy-Preserving Mechanism Design",a:["Haohui Zhang","Sirui Shen","Xinyu Hu","Chenglu Jin"],v:"Conference on Game Theory and AI for Security (GameSec'25)",y:2025,g:["Privacy","Security","Game Theory"],l:{Paper:"https://link.springer.com/chapter/10.1007/978-3-032-08064-6_12",Artifact:"https://github.com/NomadShen/TinyGarble2.0","Online Archive":"https://arxiv.org/abs/2508.15844"}},
{i:3,t:"Breaking XOR Arbiter PUFs with Chosen Challenge Attack",a:["Niloufar Sayadi","Phuong Ha Nguyen","Marten van Dijk","Chenglu Jin"],v:"IEEE Transactions on Information Forensics and Security (TIFS'25)",y:2025,g:["Hardware Security","PUF","Cryptography"],l:{Paper:"https://ieeexplore.ieee.org/abstract/document/10982292/",Artifact:"https://github.com/niloufarsyd/Chosen_Challenge_Attack","Online Archive":"https://ir.cwi.nl/pub/35170"}},
{i:4,t:"Making Deals with the Devils: the Art of Negotiation after Ransomware Attacks",a:["Haohui Zhang","Xinyu Hu","Chenglu Jin"],v:"International Workshop on Security Protocols (SPW'25)",y:2025,g:["Security","Negotiation"],l:{}},
{i:5,t:"Reading It Like an Open Book: Single-trace Blind Side-channel Attacks on Garbled Circuit Frameworks",a:["Sirui Shen","Chenglu Jin"],v:"Annual Computer Security Applications Conference (ACSAC'24)",y:2024,g:["Hardware Security","Cryptography","Side-channel"],l:{Paper:"https://ieeexplore.ieee.org/document/10917952",Artifact1:"https://github.com/NomadShen/chipwhisperer",Artifact2:"https://github.com/NomadShen/fpga_based_attack",Artifact3:"https://doi.org/10.6084/m9.figshare.27284547.v1","Online Archive":"https://ir.cwi.nl/pub/35168"}},
{i:6,t:"PG: Byzantine Fault-Tolerant and Privacy-Preserving Sensor Fusion with Guaranteed Output Delivery",a:["Chenglu Jin*","Chao Yin*","Marten van Dijk","Sisi Duan","Fabio Massacci","Michael K. Reiter","Haibin Zhang"],v:"ACM Conference on Computer and Communications Security (CCS'24)",y:2024,g:["Privacy","Cyber-Physical Systems","Security"],l:{Paper:"https://dl.acm.org/doi/abs/10.1145/3658644.3670343",Artifact:"https://figshare.com/articles/software/PG_source_code/25669026","Online Archive":"https://ir.cwi.nl/pub/34722",Slides1:"../files/PG_CCS.pdf",Slides2:"../files/PG.pdf"}},
{i:7,t:"Dynamic Group Time-based One-time Passwords",a:["Xuelian Cao","Zheng Yang","Jianting Ning","Chenglu Jin","Rongxing Lu","Zhiming Liu","Jianying Zhou"],v:"IEEE Transactions on Information Forensics and Security (TIFS'24)",y:2024,g:["Cryptography","Security"],l:{Paper:"https://ieeexplore.ieee.org/document/10494770","Online Archive":"https://ir.cwi.nl/pub/34124"}},
{i:8,t:"Masked Memory Primitive for Key Insulated Schemes",a:["Zachary DiMeglio","Jenna Bustami","Deniz Gurevin","Chenglu Jin","Marten van Dijk","Omer Khan"],v:"IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'24)",y:2024,g:["Hardware Security","Cryptography"],l:{Paper:"https://ieeexplore.ieee.org/abstract/document/10545375","Online Archive":"https://ir.cwi.nl/pub/34270"}},
{i:9,t:"Privacy and Integrity Protection for IoT Multimodal Data using Machine Learning and Blockchain",a:["Qingzhi Liu","Yuchen Huang","Chenglu Jin","Xiaohan Zhou","Ying Mao","Cagatay Catal","Long Cheng"],v:"ACM Transactions on Multimedia Computing Communications and Applications (TOMM'23)",y:2023,g:["Hardware Security","Cryptography"],l:{Paper:"https://dl.acm.org/doi/10.1145/3638769","Online Archive":"https://ir.cwi.nl/pub/34794"}},
{i:10,t:"Optimizing Proof of Aliveness in Cyber-Physical Systems",a:["Zheng Yang*","Chenglu Jin*","Xuelian Cao","Marten van Dijk","Jianying Zhou"],v:"IEEE Transactions on Dependable and Secure Computing (TDSC'23)",y:2023,g:["Cyber-Physical Systems","Security"],l:{Paper:"https://ieeexplore.ieee.org/abstract/document/10324378","Online Archive":"https://ir.cwi.nl/pub/33586",Slides:"../files/PoA_RICSS2024.pdf"}},
{i:11,t:"Secure Remote Attestation with Strong Key Insulation Guarantees",a:["Deniz Gurevin","Chenglu Jin","Phuong Ha Nguyen","Omer Khan","Marten van Dijk"],v:"IEEE Transactions on Computers (TC'23)",y:2023,g:["Hardware Security","Cryptography"],l:{Paper:"https://ieeexplore.ieee.org/document/10168259","Online Archive":"https://ir.cwi.nl/pub/33247"}},
{i:12,t:"A Theoretical Framework for the Analysis of Physical Unclonable Function Interfaces and its Relation to the Random Oracle Model",a:["Marten van Dijk","Chenglu Jin"],v:"Journal of Cryptology (JoC'23)",y:2023,g:["PUF","Cryptography"],l:{Paper:"https://link.springer.com/article/10.1007/s00145-023-09475-1"}},
{i:13,t:"HMACCE: Establishing Authenticated and Confidential Channel From Historical Data for Industrial Internet of Things",a:["Chenglu Jin*","Zheng Yang*","Tao Xiang","Sridhar Adepu","Jianying Zhou"],v:"IEEE Transactions on Information Forensics and Security (TIFS'23)",y:2023,g:["IoT","Security","Cryptography"],l:{Paper:"https://ieeexplore.ieee.org/document/10007864","Online Archive":"https://ir.cwi.nl/pub/31499"}},
{i:14,t:"Programmable Access-Controlled and Generic Erasable PUF Design and Its Applications",a:["Chenglu Jin","Wayne Burleson","Marten van Dijk","Ulrich Rührmair"],v:"Journal of Cryptographic Engineering (JCEN'22)",y:2022,g:["PUF","Hardware Security","Cryptography"],l:{Paper:"https://link.springer.com/article/10.1007/s13389-022-00284-z","Online Archive":"https://ir.cwi.nl/pub/31493/"}},
{i:15,t:"Group Time-based One-time Passwords and its Application to Efficient Privacy-Preserving Proof of Location",a:["Zheng Yang","Chenglu Jin","Jianting Ning","Zengpeng Li","Tien Tuan Anh Dinh","Jianying Zhou"],v:"Annual Computer Security Applications Conference (ACSAC'21)",y:2021,g:["Cryptography","Privacy","Security"],l:{Paper:"https://dl.acm.org/doi/10.1145/3485832.3488009","Online Archive":"https://ir.cwi.nl/pub/31289",Slides:"../files/GTOTP_ACSAC.pdf"}},
{i:16,t:"PLCrypto: A Symmetric Cryptographic Library for Programmable Logic Controllers",a:["Zheng Yang","Zhiting Bao","Chenglu Jin","Zhe Liu","Jianying Zhou"],v:"IACR Transactions on Symmetric Cryptology (ToSC'21)",y:2021,g:["Cryptography","Cyber-Physical Systems"],l:{Paper:"https://tosc.iacr.org/index.php/ToSC/article/view/9178",Artifact:"https://github.com/PLCrypto/PLCrypto"}},
{i:17,t:"HACK3D: Crowdsourcing the Assessment of Cybersecurity in Digital Manufacturing",a:["Michael Linares*","Nishant Aswani*","Gary Mac","Chenglu Jin","Fei Chen","Nikhil Gupta","Ramesh Karri"],v:"IEEE Computer'21",y:2021,g:["Security"],l:{Paper:"https://ieeexplore.ieee.org/abstract/document/9585150","Online Archive":"https://ir.cwi.nl/pub/31211"}},
{i:18,t:"Lightweight Delegated Authentication with Identity Fraud Detection for Cyber-physical Systems",a:["Zheng Yang","Chao Yin","Chenglu Jin","Jianting Ning","Jianying Zhou"],v:"ACM Cyber-Physical System Security Workshop (CPSS@AsiaCCS'21)",y:2021,g:["Cyber-Physical Systems","Security"],l:{Paper:"https://dl.acm.org/doi/abs/10.1145/3457339.3457984","Online Archive":"https://ir.cwi.nl/pub/30891"}},
{i:19,t:"A Survey of Cybersecurity of Digital Manufacturing",a:["Priyanka Mahesh","Akash Tiwari","Chenglu Jin","Panganamala R. Kumar","A. L. Narasimha Reddy","Satish T.S. Bukkapatanam","Nikhil Gupta","Ramesh Karri"],v:"Proceedings of the IEEE (PIEEE'21)",y:2021,g:["Security"],l:{Paper:"https://ieeexplore.ieee.org/document/9247392",Presentation:"https://www.youtube.com/watch?v=1KQmPjAGaEM"}},
{i:20,t:"Erasable PUFs: Formal Treatment and Generic Design",a:["Chenglu Jin","Wayne Burleson","Marten van Dijk","Ulrich Rührmair"],v:"Workshop on Attacks and Solutions in Hardware Security (ASHES@CCS'20)",y:2020,g:["PUF","Hardware Security","Cryptography"],l:{Paper:"https://dl.acm.org/doi/10.1145/3411504.3421215","Online Archive":"https://ir.cwi.nl/pub/30393",Slides:"../files/Erasable_PUF_ASHES.pdf"}},
{i:21,t:"LiS: Lightweight Signature Schemes for Continuous Message Authentication in Cyber-Physical Systems",a:["Zheng Yang","Chenglu Jin","Yangguang Tian","Junyu Lai","Jianying Zhou"],v:"ACM Asia Conference on Computer and Communications Security (AsiaCCS'20)",y:2020,g:["Cryptography","Cyber-Physical Systems","Security"],l:{Paper:"https://dl.acm.org/doi/abs/10.1145/3320269.3372195",Presentation:"https://dl.acm.org/doi/abs/10.1145/3320269.3372195"}},
{i:22,t:"Proof of Aliveness",a:["Chenglu Jin*","Zheng Yang*","Marten van Dijk","Jianying Zhou"],v:"Annual Computer Security Applications Conference (ACSAC'19)",y:2019,g:["Cyber-Physical Systems","Security"],l:{Paper:"https://dl.acm.org/citation.cfm?id=3359827",Artifact:"https://github.com/ChengluJin/Proof_of_Aliveness",Slides:"https://www.acsac.org/2019/program/final/1/174.pdf"}},
{i:23,t:"The Interpose PUF: Secure PUF Design against State-of-the-art Machine Learning Attacks",a:["Phuong Ha Nguyen","Durga Prasad Sahoo","Chenglu Jin","Kaleel Mahmood","Ulrich Rührmair","Marten van Dijk"],v:"IACR Transactions on Cryptographic Hardware and Embedded Systems (TCHES'19)",y:2019,g:["PUF","Hardware Security","Cryptography"],l:{Paper:"https://tches.iacr.org/index.php/TCHES/article/view/8351",Artifact:"https://github.com/scluconn/DA_PUF_Library",Presentation:"https://www.youtube.com/watch?v=m0cvYXamZlg",Tutorial:"https://www.youtube.com/watch?v=kBpQL3_7KJA&list=PLK5NNs4GceLQw7bOEHSdZOwHlmSF1zvSW"}},
{i:24,t:"Exploiting Lithography Limits for Hardware Security Applications",a:["Raihan Sayeed Khan","Nafisa Noor","Chenglu Jin","Sadid Muneer","Faruk Dirisaglik","Adam Cywar","Phuong Ha Nguyen","Marten van Dijk","Ali Gokirmak","Helena Silva"],v:"IEEE Conference on Nanotechnology (IEEE-NANO'19)",y:2019,g:["Hardware Security"],l:{Paper:"https://ieeexplore.ieee.org/abstract/document/8993902","Online Archive":"https://par.nsf.gov/servlets/purl/10198072"}},
{i:25,t:"Secure and Efficient Initialization and Authentication Protocols for SHIELD",a:["Chenglu Jin","Marten van Dijk"],v:"IEEE Transactions on Dependable and Secure Computing (TDSC'19)",y:2019,g:["Hardware Security","Cryptography"],l:{Paper:"http://ieeexplore.ieee.org/document/7807281","Online Archive":"https://eprint.iacr.org/2015/210",Slides:"../files/SHIELD.pdf"}},
{i:26,t:"Advancing the State-of-the-Art in Hardware Trojans Detection",a:["Syed Kamran Haider","Chenglu Jin","Masab Ahmad","Devu Manikantan Shila","Omer Khan","Marten van Dijk"],v:"IEEE Transactions on Dependable and Secure Computing (TDSC'19)",y:2019,g:["Hardware Security"],l:{Paper:"http://ieeexplore.ieee.org/document/7820150","Online Archive":"https://eprint.iacr.org/2014/943",Presentation:"https://www.youtube.com/watch?v=KXxbifX01jw"}},
{i:27,t:"Snapshotter: Lightweight Intrusion Detection and Prevention System for Industrial Control Systems",a:["Chenglu Jin","Saeed Valizadeh","Marten van Dijk"],v:"IEEE International Conference on Industrial Cyber-Physical Systems (ICPS'18)",y:2018,g:["Cyber-Physical Systems","Security"],l:{Paper:"https://ieeexplore.ieee.org/document/8390813",Slides:"../files/Snapshotter.pdf"}},
{i:28,t:"Weak-Unforgeable Tags for Secure Supply Chain Management",a:["Marten van Dijk","Chenglu Jin","Hoda Maleki","Phuong Ha Nguyen","Reza Rahaeimehr"],v:"International Conference on Financial Cryptography and Data Security (FC'18)",y:2018,g:["Cryptography","Security"],l:{Paper:"https://link.springer.com/chapter/10.1007/978-3-662-58387-6_5","Full Version":"https://eprint.iacr.org/2017/1221.pdf"}},
{i:29,t:"FPGA Implementation of a Cryptographically-Secure PUF based on Learning Parity with Noise",a:["Chenglu Jin","Charles Herder","Ling Ren","Phuong Ha Nguyen","Benjamin Fuller","Srinivas Devadas","Marten van Dijk"],v:"Cryptography'17",y:2017,g:["PUF","Hardware Security","Cryptography"],l:{Paper:"http://www.mdpi.com/2410-387X/1/3/23",Artifact:"https://github.com/scluconn/LPN-based_PUF"}},
{i:30,t:"Phase Calibrated Ring Oscillator PUF Design and Implementation on FPGAs",a:["Wei Yan","Chenglu Jin","Fatemeh Tehranipoor","John A. Chandy"],v:"International Conference on Field-Programmable Logic and Applications (FPL'17)",y:2017,g:["PUF","Hardware Security"],l:{Paper:"https://ieeexplore.ieee.org/document/8056859","Online Archive":"https://www.researchgate.net/publication/320250281_Phase_calibrated_ring_oscillator_PUF_design_and_implementation_on_FPGAs"}},
{i:31,t:"Advancing the State-of-the-Art in Hardware Trojans Design",a:["Syed Kamran Haider","Chenglu Jin","Marten van Dijk"],v:"IEEE International Midwest Symposium on Circuits and Systems (MWSCAS'17)",y:2017,g:["Hardware Security"],l:{Paper:"https://ieeexplore.ieee.org/document/8053050","Full Version":"http://arxiv.org/abs/1605.08413"}},
{i:32,t:"New Clone-Detection Approach for RFID-Based Supply Chains",a:["Hoda Maleki","Reza Rahaeimehr","Chenglu Jin","Marten van Dijk"],v:"IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'17)",y:2017,g:["Hardware Security","Cryptography"],l:{Paper:"https://ieeexplore.ieee.org/document/7951810"}},
{i:33,t:"Mitigating Synchronized Hardware Trojan Attacks in Smart Grids",a:["Chenglu Jin","Lingyu Ren","Xubin Liu","Peng Zhang","Marten van Dijk"],v:"Workshop on Cyber-Physical Security and Resilience in Smart Grids (CPSR-SG@CPSWeek'17)",y:2017,g:["Hardware Security","Cyber-Physical Systems"],l:{Paper:"http://dl.acm.org/citation.cfm?id=3055394","Online Archive":"https://par.nsf.gov/servlets/purl/10049484",Slides:"../files/SHT_CPSRSG.pdf"}},
{i:34,t:"Can Algorithm Diversity in Stream Cipher Implementation Thwart (Natural and) Malicious Faults?",a:["Xiaofei Guo","Chenglu Jin","Chi Zhang","Athanasios Papadimitriou","David Hély","Ramesh Karri"],v:"IEEE Transactions on Emerging Topics in Computing (TETC'16)",y:2016,g:["Cryptography","Hardware Security"],l:{Paper:"http://ieeexplore.ieee.org/document/7110553"}},
{i:35,t:"Simulation and Analysis of Negative-Bias Temperature Instability Aging on Power Analysis Attacks",a:["Xiaofei Guo","Naghmeh Karimi","Francesco Regazzoni","Chenglu Jin","Ramesh Karri"],v:"IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'15)",y:2015,g:["Hardware Security","Side-channel"],l:{Paper:"https://ieeexplore.ieee.org/document/7140250","Online Archive":"https://www.researchgate.net/publication/283229984_Simulation_and_analysis_of_negative-bias_temperature_instability_aging_on_power_analysis_attacks"}},
{i:36,t:"Security Analysis of Concurrent Error Detection against Differential Fault Analysis",a:["Xiaofei Guo","Debdeep Mukhopadhyay","Chenglu Jin","Ramesh Karri"],v:"Journal of Cryptographic Engineering (JCEN'15)",y:2015,g:["Cryptography","Hardware Security"],l:{Paper:"http://link.springer.com/article/10.1007/s13389-014-0092-8"}},
{i:37,t:"NREPO: Normal Basis Recomputing with Permuted Operands",a:["Xiaofei Guo","Debdeep Mukhopadhyay","Chenglu Jin","Ramesh Karri"],v:"IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'14)",y:2014,g:["Cryptography","Hardware Security"],l:{Paper:"https://ieeexplore.ieee.org/document/6855581","Online Archive":"https://eprint.iacr.org/2014/497"}}
];

var tags=[],sel=[];
for(var i=0;i<d.length;i++)for(var j=0;j<d[i].g.length;j++)if(tags.indexOf(d[i].g[j])===-1)tags.push(d[i].g[j]);
tags.sort();

function fmt(v){return v.replace(/(\(.*?\))/g,'<strong>$1</strong>');}

function drawF(){
var c=document.getElementById('filterButtons'),h='';
for(var i=0;i<tags.length;i++)h+='<button class="filter-btn" data-tag="'+tags[i]+'">'+tags[i]+'</button>';
h+='<button class="clear-btn" id="clr" style="display:none">[Clear]</button>';
c.innerHTML=h;
var btns=c.querySelectorAll('.filter-btn');
for(var i=0;i<btns.length;i++)btns[i].onclick=function(){tog(this.getAttribute('data-tag'));};
document.getElementById('clr').onclick=function(){sel=[];upd();};
}

function tog(t){
var idx=sel.indexOf(t);
if(idx>-1)sel.splice(idx,1);else sel.push(t);
upd();
}

function upd(){
var btns=document.querySelectorAll('.filter-btn');
for(var i=0;i<btns.length;i++){
if(sel.indexOf(btns[i].getAttribute('data-tag'))>-1)btns[i].classList.add('active');
else btns[i].classList.remove('active');
}
document.getElementById('clr').style.display=sel.length>0?'inline-block':'none';
var f=sel.length===0?d:d.filter(function(p){for(var i=0;i<sel.length;i++)if(p.g.indexOf(sel[i])>-1)return true;return false;});
draw(f);
}

function draw(pubs){
var years={};
for(var i=0;i<pubs.length;i++){
if(!years[pubs[i].y])years[pubs[i].y]=[];
years[pubs[i].y].push(pubs[i]);
}
var yrs=Object.keys(years).sort(function(a,b){return b-a;});
var h='';
for(var yi=0;yi<yrs.length;yi++){
var yr=yrs[yi];
h+='<div class="year-section"><h2 class="year-header">'+yr+'</h2>';
for(var i=0;i<years[yr].length;i++){
var p=years[yr][i];
h+='<div class="publication"><h3 class="pub-title">'+p.t+'</h3><div class="pub-authors">';
for(var j=0;j<p.a.length;j++){
var au=p.a[j];
h+=au.indexOf("Chenglu Jin")>-1?'<span class="pub-author-highlight">'+au+'</span>':au;
if(j<p.a.length-1)h+=', ';
}
h+='</div><div class="pub-venue">'+fmt(p.v)+', '+p.y+'</div><div class="pub-paper-links">';
for(var k in p.l)if(p.l.hasOwnProperty(k))h+='<a href="'+p.l[k]+'" target="_blank">['+k+']</a>';
h+='</div></div>';
}
h+='</div>';
}
document.getElementById('publicationsList').innerHTML=h;
}

function init(){
if(document.getElementById('filterButtons')&&document.getElementById('publicationsList')){
drawF();draw(d);
}else setTimeout(init,50);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
</script>
