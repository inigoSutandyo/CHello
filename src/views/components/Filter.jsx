import React from "react";

export const Filter = ({ labels, handleFilterChange }) => {
  return (
    <div className="accordion w-50" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Filter
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="container text-center">
              <div className="row row-cols-3">
                {labels?.map((l) => (
                  <div className="col" key={l.uid}>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      name="check"
                      id={l.uid}
                      value={l.uid}
                      onChange={handleFilterChange}
                    />
                    <label htmlFor="id" className="form-check-label">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: `${l.color}`,
                        }}
                      >
                        {l.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
