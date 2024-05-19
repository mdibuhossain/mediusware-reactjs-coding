import React, { useState } from "react";

const Problem1 = () => {
  const [show, setShow] = useState("all");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleClick = (val) => {
    setShow(val);
    handleFilterData(val, allData);
  };

  const handleFilterData = (val, dataList) => {
    if (val === "all") {
      const tmpData = dataList.sort((a, b) => {
        if (a.status === "active") {
          return -1;
        } else if (a.status === "completed" && b.status !== "active") {
          return -1;
        } else {
          return 1;
        }
      });
      setFilteredData(tmpData);
    } else if (val === "active" || val === "completed") {
      const tmpData = dataList.filter((item) => item.status === val);
      setFilteredData(tmpData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value.trim();
    const status = e.target[1].value.trim().toLowerCase();
    if (name === "" || status === "") {
      alert("Please fill all fields");
      return;
    }
    const tmpData = [...allData, { name, status }];
    setAllData(tmpData);
    handleFilterData(show, tmpData);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form
            onSubmit={handleSubmit}
            className="row gy-2 gx-3 align-items-center mb-4"
          >
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                required
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Status"
                required
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              {filteredData?.map((item, index) => {
                // if (show === "all" || item.status === show) {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                  </tr>
                );
                // }
              })}
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
