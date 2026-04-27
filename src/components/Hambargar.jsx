function Hambargar({ toggle, sidebarActive }) {
    return <>
        <div className={sidebarActive ? "overlay active" : "overlay"} onClick={toggle}></div>
        <button className="hamburger" onClick={toggle}>
            <i className="fas fa-bars"></i>
        </button>
    </>
}

export default Hambargar;
