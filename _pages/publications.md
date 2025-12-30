---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

<div id="publications-root"></div>

<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>

<script type="text/babel" data-type="module">
const { useState, useMemo } = React;

const PUBLICATIONS_DATA = [
  {
    id: 1,
    title: "CacheGuardian: A Timing Side-Channel Resilient LLC Design.",
    authors: ["Ziang Zhou", "Qi Zhu", "Hao Lan", "Huifeng Zhu", "Wei Yan", "Chenglu Jin", "Xuejun An", "Xiaochun Ye"],
    venue: "International Conference on Computer-Aided Design (ICCAD'25)",
    year: 2025,
    tags: ["Hardware Security", "Architecture"],
    links: { Paper: "#" }
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
    links: { Paper: "#" }
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

const ALL_TAGS = Array.from(new Set(PUBLICATIONS_DATA.flatMap(p => p.tags))).sort();

function App() {
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredPublications = useMemo(() => {
    if (selectedTags.length === 0) return PUBLICATIONS_DATA;
    return PUBLICATIONS_DATA.filter(pub => 
      selectedTags.some(tag => pub.tags.includes(tag))
    );
  }, [selectedTags]);

  const formatVenue = (venueStr) => {
    const parts = venueStr.split(/(\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("(") && part.endsWith(")")) {
        return React.createElement('strong', { 
          key: i, 
          className: "font-bold text-black" 
        }, part);
      }
      return React.createElement('span', { key: i }, part);
    });
  };

  return React.createElement('div', {
    className: "min-h-screen bg-white text-[#333] py-12 px-4 sm:px-6 lg:px-8 leading-relaxed"
  },
    React.createElement('div', { className: "max-w-3xl mx-auto" },
      React.createElement('header', { className: "mb-10 border-b border-gray-100 pb-6" },
        React.createElement('h1', { 
          className: "text-3xl font-bold text-black tracking-tight" 
        }, "Publications"),
        React.createElement('div', { className: "mt-4 flex flex-col gap-1 font-sans" },
          React.createElement('p', { className: "text-sm text-gray-500" },
            "You can also find my publications on ",
            React.createElement('a', {
              href: "https://scholar.google.com/citations?user=Fxm2RTUAAAAJ",
              className: "text-blue-600 hover:underline"
            }, "Google Scholar"),
            " and ",
            React.createElement('a', {
              href: "https://dblp.org/pid/148/1500.html",
              className: "text-blue-600 hover:underline"
            }, "dblp")
          ),
          React.createElement('p', { className: "text-xs text-gray-400 italic" },
            React.createElement('sup', null, "*"),
            " denotes shared first authorship"
          )
        )
      ),
      React.createElement('section', { className: "mb-12" },
        React.createElement('div', {
          className: "text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 font-sans"
        }, "Filter by Theme:"),
        React.createElement('div', { className: "flex flex-wrap gap-x-5 gap-y-3" },
          ALL_TAGS.map(tag =>
            React.createElement('button', {
              key: tag,
              onClick: () => toggleTag(tag),
              className: `text-[14px] transition-all duration-200 border-b ${
                selectedTags.includes(tag)
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-400'
              }`
            }, tag)
          ),
          selectedTags.length > 0 && React.createElement('button', {
            onClick: () => setSelectedTags([]),
            className: "text-[12px] text-red-400 font-sans italic ml-2"
          }, "[Clear]")
        )
      ),
      React.createElement('div', { className: "space-y-12" },
        filteredPublications.map(pub =>
          React.createElement('div', { key: pub.id, className: "group" },
            React.createElement('div', { className: "flex flex-col gap-1.5" },
              React.createElement('h3', {
                className: "text-[19px] font-bold text-black leading-tight group-hover:text-blue-700 transition-colors"
              }, pub.title),
              React.createElement('div', { className: "text-[15px] text-gray-700" },
                pub.authors.map((author, index) =>
                  React.createElement('span', { key: index },
                    React.createElement('span', {
                      className: author.includes("Chenglu Jin") ? "font-bold text-black" : ""
                    }, author),
                    index < pub.authors.length - 1 ? ", " : ""
                  )
                )
              ),
              React.createElement('div', { className: "text-[14px] text-gray-500 italic" },
                formatVenue(pub.venue),
                ", ",
                pub.year
              ),
              React.createElement('div', { className: "mt-2 flex gap-4" },
                Object.entries(pub.links).map(([type, url]) =>
                  url !== "#" && React.createElement('a', {
                    key: type,
                    href: url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-[12px] font-sans font-bold text-blue-600 uppercase tracking-wider"
                  }, `[${type}]`)
                )
              )
            )
          )
        )
      )
    )
  );
}

setTimeout(() => {
  const rootElement = document.getElementById('publications-root');
  if (rootElement && typeof ReactDOM !== 'undefined') {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
}, 100);
</script>
