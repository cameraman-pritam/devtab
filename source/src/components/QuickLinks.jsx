import { useState, useEffect } from "react";

export default function QuickLinks() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("devtab-links")) || [
      { name: "GitHub", url: "https://github.com" },
      { name: "Supabase", url: "https://supabase.com" },
    ];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLinks(stored);
  }, []);

  const saveLinks = (newLinks) => {
    setLinks(newLinks);
    localStorage.setItem("devtab-links", JSON.stringify(newLinks));
  };

  const handleAdd = () => {
    const name = prompt("Link Name:");
    if (!name) return;
    let url = prompt("URL:");
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    saveLinks([...links, { name, url }]);
  };

  const handleDelete = (e, index, name) => {
    e.preventDefault(); // Prevent opening the link
    if (confirm(`Delete ${name}?`)) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      saveLinks(newLinks);
    }
  };

  return (
    <section className="quick-links-section">
      <div className="quick-links-container">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            className="quick-link"
            onContextMenu={(e) => handleDelete(e, i, link.name)}
          >
            {link.name}
          </a>
        ))}
      </div>
      <button className="add-link-btn" onClick={handleAdd} title="Add Link">
        +
      </button>
    </section>
  );
}
