function EventFilter({
    search,
    setSearch,
    category,
    setCategory,
}) {
    return (
    <div className="row g-3 mb-4">

        <div className="col-md-6">
        <input
            type="text"
            className="form-control"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        </div>

        <div className="col-md-6">
        <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Cultural">Cultural</option>
        </select>
        </div>

    </div>
    );
}

export default EventFilter;