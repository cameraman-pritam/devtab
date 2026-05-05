export default function SearchBar() {
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  return (
    <section className="search-section">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          className="search-input"
          placeholder="Search the web..."
          autoComplete="off"
          autoFocus
        />
      </form>
    </section>
  );
}
