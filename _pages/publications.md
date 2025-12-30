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
  
  .pub-header h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #000;
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
    <h1>Publications</h1>
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
(function() {
  const PUBLICATIONS_DATA = [
    {
      id: 1,
      title: "CacheGuardian: A Timing Side-Channel Resilient LLC Design.",
      authors: ["Ziang Zhou", "Qi Zhu", "Hao Lan", "Huifeng Zhu", "Wei Yan", "Chenglu Jin", "Xuejun An", "Xiaochun Ye"],
      venue: "International Conference on Computer-Aided Design (ICCAD'25)",
      year: 2025,
      tags: ["Hardware Security", "Architecture"],
      links: {}
    },
    {
      id: 2,
      title: "Ransomware Negotiation: Dynamics and Privacy-Preserving Mechanism Design",
      authors: ["Haohui Zhang", "Sirui Shen", "Xinyu Hu", "Chenglu Jin"],
      venue: "Conference on Game Theory and AI for Security (GameSec'25)",
      year: 2025,
      tags: ["Privacy", "Security", "Game Theory"],
      links: { 
        Paper: "https://link.springer.com/chapter/10.1007/978-3-032-08064-6_12", 
        Artifact: "https://github.com/NomadShen/TinyGarble2.0", 
        Archive: "https://arxiv.org/abs/2508.15844" 
      }
    },
    {
      id: 3,
      title: "Breaking XOR Arbiter PUFs with Chosen Challenge Attack",
      authors: ["Niloufar Sayadi", "Phuong Ha Nguyen", "Marten van Dijk", "Chenglu Jin"],
      venue: "IEEE Transactions on Information Forensics and Security (TIFS'25)",
      year: 2025,
      tags: ["Hardware Security", "PUF", "Cryptography"],
      links: { 
        Paper: "https://ieeexplore.ieee.org/abstract/document/10982292/", 
        Artifact: "https://github.com/niloufarsyd/Chosen_Challenge_Attack" 
      }
    },
    {
      id: 4,
      title: "Making Deals with the Devils: the Art of Negotiation after Ransomware Attacks",
      authors: ["Haohui Zhang", "Xinyu Hu", "Chenglu Jin"],
      venue: "International Workshop on Security Protocols (SPW'25)",
      year: 2025,
      tags: ["Security", "Negotiation"],
      links: {}
    },
    {
      id: 5,
      title: "Reading It Like an Open Book: Single-trace Blind Side-channel Attacks on Garbled Circuit Frameworks",
      authors: ["Sirui Shen", "Chenglu Jin"],
      venue: "Annual Computer Security Applications Conference (ACSAC'24)",
      year: 2024,
      tags: ["Hardware Security", "Cryptography", "Side-channel"],
      links: { 
        Paper: "https://ieeexplore.ieee.org/document/10917952", 
        Artifact: "https://github.com/NomadShen/chipwhisperer" 
      }
    },
    {
      id: 6,
      title: "PG: Byzantine Fault-Tolerant and Privacy-Preserving Sensor Fusion with Guaranteed Output Delivery",
      authors: ["Chenglu Jin*", "Chao Yin*", "Marten van Dijk", "Sisi Duan", "Fabio Massacci", "Michael K. Reiter", "Haibin Zhang"],
      venue: "ACM Conference on Computer and Communications Security (CCS'24)",
      year: 2024,
      tags: ["Privacy", "Cyber-Physical Systems", "Security"],
      links: { 
        Paper: "https://dl.acm.org/doi/abs/10.1145/3658644.3670343", 
        Artifact: "https://figshare.com/articles/software/PG_source_code/25669026" 
      }
    },
    {
      id: 7,
      title: "Dynamic Group Time-based One-time Passwords",
      authors: ["Xuelian Cao", "Zheng Yang", "Jianting Ning", "Chenglu Jin", "Rongxing Lu", "Zhiming Liu", "Jianying Zhou"],
      venue: "IEEE Transactions on Information Forensics and Security (TIFS'24)",
      year: 2024,
      tags: ["Cryptography", "Security"],
      links: { Paper: "https://ieeexplore.ieee.org/document/10494770" }
    },
    {
      id: 8,
      title: "Masked Memory Primitive for Key Insulated Schemes",
      authors: ["Zachary DiMeglio", "Jenna Bustami", "Deniz Gurevin", "Chenglu Jin", "Marten van Dijk", "Omer Khan"],
      venue: "IEEE International Symposium on Hardware-Oriented Security and Trust (HOST'24)",
      year: 2024,
      tags: ["Hardware Security", "Cryptography"],
      links: { Paper: "https://ieeexplore.ieee.org/abstract/document/10545375" }
    },
    {
      id: 9,
      title: "Privacy and Integrity Protection for IoT Multimodal Data using Machine Learning and Blockchain",
      authors: ["Qingzhi Liu", "Yuchen Huang", "Chenglu Jin", "Xiaohan Zhou", "Ying Mao", "Cagatay Catal", "Long Cheng"],
      venue: "ACM Transactions on Multimedia Computing Communications and Applications (TOMM'23)",
      year: 2023,
      tags: ["Hardware Security", "Cryptography"],
      links: { 
        Paper: "https://dl.acm.org/doi/10.1145/3638769", 
        "Online Archive": "https://ir.cwi.nl/pub/34794" 
      }
    },
    {
      id: 10,
      title: "Optimizing Proof of Aliveness in Cyber-Physical Systems",
      authors: ["Zheng Yang*", "Chenglu Jin*", "Xuelian Cao", "Marten van Dijk", "Jianying Zhou"],
      venue: "TDSC'23",
      year: 2023,
      tags: ["Cyber-Physical Systems", "Security"],
      links: { Paper: "https://ieeexplore.ieee.org/abstract/document/10324378" }
    },
    {
      id: 13,
      title: "HMACCE: Establishing Authenticated and Confidential Channel From Historical Data for Industrial Internet of Things",
      authors: ["Chenglu Jin*", "Zheng Yang*", "Tao Xiang", "Sridhar Adepu", "Jianying Zhou"],
      venue: "TIFS'23",
      year: 2023,
      tags: ["IoT", "Security", "Cryptography"],
      links: { Paper: "https://ieeexplore.ieee.org/document/10007864" }
    }
  ];

  const allTags = Array.from(new Set(PUBLICATIONS_DATA.flatMap(p => p.tags))).sort();
  let selectedTags = [];

  function formatVenue(venueStr) {
    return venueStr.replace(/(\(.*?\))/g, '<strong>$1</strong>');
  }

  function renderFilters() {
    const container = document.getElementById('filterButtons');
    container.innerHTML = allTags.map(tag => 
      `<button class="filter-btn" data-tag="${tag}">${tag}</button>`
    ).join('');
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-btn';
    clearBtn.textContent = '[Clear]';
    clearBtn.style.display = 'none';
    clearBtn.onclick = clearFilters;
    container.appendChild(clearBtn);

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => toggleTag(btn.dataset.tag);
    });
  }

  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags.push(tag);
    }
    updateUI();
  }

  function clearFilters() {
    selectedTags = [];
    updateUI();
  }

  function updateUI() {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', selectedTags.includes(btn.dataset.tag));
    });
    
    // Show/hide clear button
    const clearBtn = document.querySelector('.clear-btn');
    clearBtn.style.display = selectedTags.length > 0 ? 'inline-block' : 'none';

    // Filter publications
    const filtered = selectedTags.length === 0 
      ? PUBLICATIONS_DATA 
      : PUBLICATIONS_DATA.filter(pub => 
          selectedTags.some(tag => pub.tags.includes(tag))
        );
    
    renderPublications(filtered);
  }

  function renderPublications(pubs) {
    const container = document.getElementById('publicationsList');
    container.innerHTML = pubs.map(pub => `
      <div class="publication">
        <h3 class="pub-title">${pub.title}</h3>
        <div class="pub-authors">
          ${pub.authors.map(author => 
            author.includes("Chenglu Jin") 
              ? `<span class="pub-author-highlight">${author}</span>`
              : author
          ).join(', ')}
        </div>
        <div class="pub-venue">${formatVenue(pub.venue)}, ${pub.year}</div>
        <div class="pub-paper-links">
          ${Object.entries(pub.links).map(([type, url]) => 
            `<a href="${url}" target="_blank" rel="noopener noreferrer">[${type}]</a>`
          ).join('')}
        </div>
      </div>
    `).join('');
  }

  // Initialize
  renderFilters();
  renderPublications(PUBLICATIONS_DATA);
})();
</script>
