import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useSearchParams } from "react-router-dom";

const Problem2 = () => {
  const [searchParams] = useSearchParams();
  const modal = searchParams.get("modal");
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);
  const [individualContact, setIndividualContact] = useState({});

  const handleCloseA = () => {
    setShowA(false);
  };
  const handleCloseB = () => {
    setShowB(false);
  };
  const handleCloseC = () => {
    setShowC(false);
  };
  const handleShowA = () => {
    setShowB(false);
    setShowA(true);
  };
  const handleShowB = () => {
    setShowA(false);
    setShowB(true);
  };
  const handleShowC = () => {
    setShowC(true);
  };

  const handleFetchIndividualContact = (data) => {
    setIndividualContact(data);
    handleShowC();
  };

  const ModalC = () => {
    return (
      <Modal
        show={showC}
        onHide={handleCloseC}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Individual Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between">
            <div>
              <p>Id: {individualContact?.id}</p>
              <p>Phone: {individualContact?.phone}</p>
              <p>Country: {individualContact?.country?.name}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="white"
            style={{ border: "1px solid #46139f" }}
            onClick={handleCloseC}
          >
            {" "}
            Close{" "}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ModalA = () => {
    const [contacts, setContacts] = useState([]);
    const [pageData, setPageData] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [onlyEvenSelected, setOnlyEvenSelected] = useState(false);

    useEffect(() => {
      fetchContacts();
    }, [onlyEvenSelected]);

    const fetchContacts = (url, flag) => {
      try {
        axios
          .get(url || "https://contact.mediusware.com/api/contacts/")
          .then((res) => {
            setPageData({
              count: res.data.count,
              next: res.data.next,
              previous: res.data.previous,
            });
            if (onlyEvenSelected) {
              setContacts(
                res.data.results.filter((contact) => contact.id % 2 === 0)
              );
            } else if (flag) {
              setContacts(res.data.results);
            } else {
              setContacts([...contacts, ...res.data.results]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const handleSearch = (e) => {
      e.preventDefault();
      const search = e.target.search.value;
      console.log(search);
      if (search === "" || search === null) {
        fetchContacts(null, true);
      } else {
        try {
          axios
            .get(
              `https://contact.mediusware.com/api/contacts/?search=${search}`
            )
            .then((res) => {
              setPageData({
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous,
              });
              if (onlyEvenSelected) {
                setContacts(
                  res.data.results.filter((contact) => contact.id % 2 === 0)
                );
              } else {
                setContacts(res.data.results);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleScroll = (e) => {
      const bottom = e.target.scrollHeight - e.target.scrollTop;
      if (bottom <= e.target.clientHeight + 10 && pageData?.next) {
        fetchContacts(pageData?.next);
      }
    };

    return (
      <Modal
        show={showA}
        onHide={handleCloseA}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>All Contacts</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSearch}>
          <InputGroup className="my-2 px-2">
            <Form.Control
              type="text"
              name="search"
              placeholder="Search"
              aria-label="search"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
        </form>
        <Modal.Body
          style={{ maxHeight: "500px", overflowY: "scroll" }}
          onScroll={handleScroll}
        >
          {/* <InfiniteScroll
            dataLength={contacts?.length}
            next={() => fetchContacts(pageData?.next)}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          > */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Phone</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((contact, index) => (
                <tr
                  key={index}
                  onClick={() => handleFetchIndividualContact(contact)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{contact.id}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.country.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* </InfiniteScroll> */}
        </Modal.Body>
        <Modal.Footer>
          <InputGroup>
            <InputGroup.Checkbox
              onChange={(e) => setOnlyEvenSelected(e.target.checked)}
              checked={onlyEvenSelected}
              aria-label="Checkbox for following text input"
            />
            <InputGroup.Text>Only even</InputGroup.Text>
          </InputGroup>
          <Link
            to={"/problem-2/?modal=A"}
            className="btn btn-md"
            style={{ backgroundColor: "#46139f", color: "#fff" }}
            type="button"
            onClick={handleShowA}
          >
            All Contacts
          </Link>
          <Link
            to={"/problem-2/?modal=B"}
            className="btn btn-md"
            style={{ backgroundColor: "#ff7f50", color: "#fff" }}
            type="button"
            onClick={handleShowB}
          >
            US Contacts
          </Link>
          <Button
            variant="white"
            style={{ border: "1px solid #46139f" }}
            onClick={handleCloseA}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ModalB = () => {
    const [contacts, setContacts] = useState([]);
    const [pageData, setPageData] = useState({});
    const [onlyEvenSelected, setOnlyEvenSelected] = useState(false);

    useEffect(() => {
      fetchContacts();
    }, [onlyEvenSelected]);

    const fetchContacts = (url) => {
      try {
        axios
          .get(
            url ||
              "https://contact.mediusware.com/api/country-contacts/United%20States/"
          )
          .then((res) => {
            setPageData({
              count: res.data.count,
              next: res.data.next,
              previous: res.data.previous,
            });
            if (onlyEvenSelected) {
              setContacts(
                res.data.results.filter((contact) => contact.id % 2 === 0)
              );
            } else {
              setContacts([...contacts, ...res.data.results]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const handleSearch = (e) => {
      e.preventDefault();
      const search = e.target.search.value;
      console.log(search);
      if (search === "" || search === null) {
        fetchContacts(null, true);
      } else {
        try {
          axios
            .get(
              `https://contact.mediusware.com/api/country-contacts/United%20States/?search=${search}`
            )
            .then((res) => {
              setPageData({
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous,
              });
              if (onlyEvenSelected) {
                setContacts(
                  res.data.results.filter((contact) => contact.id % 2 === 0)
                );
              } else {
                setContacts(res.data.results);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleScroll = (e) => {
      const bottom = e.target.scrollHeight - e.target.scrollTop;
      if (bottom <= e.target.clientHeight + 10 && pageData?.next) {
        fetchContacts(pageData?.next);
      }
    };

    return (
      <Modal
        show={showB}
        onHide={handleCloseA}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>US Contacts</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSearch}>
          <InputGroup className="my-2 px-2">
            <Form.Control
              type="text"
              name="search"
              placeholder="Search"
              aria-label="search"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
        </form>
        <Modal.Body
          style={{ maxHeight: "500px", overflowY: "scroll" }}
          onScroll={handleScroll}
        >
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Phone</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {contacts?.map((contact, index) => (
                <tr
                  key={index}
                  onClick={() => handleFetchIndividualContact(contact)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{contact.id}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.country.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <InputGroup>
            <InputGroup.Checkbox
              onChange={(e) => setOnlyEvenSelected(e.target.checked)}
              checked={onlyEvenSelected}
              aria-label="Checkbox for following text input"
            />
            <InputGroup.Text>Only even</InputGroup.Text>
          </InputGroup>
          <Link
            to={"/problem-2/?modal=A"}
            className="btn btn-md"
            style={{ backgroundColor: "#46139f", color: "#fff" }}
            type="button"
            onClick={handleShowA}
          >
            All Contacts
          </Link>
          <Link
            to={"/problem-2/?modal=B"}
            className="btn btn-md"
            style={{ backgroundColor: "#ff7f50", color: "#fff" }}
            type="button"
            onClick={handleShowB}
          >
            US Contacts
          </Link>
          <Button
            variant="white"
            style={{ border: "1px solid #46139f" }}
            onClick={handleCloseB}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <Link
            to={"/problem-2/?modal=A"}
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={handleShowA}
          >
            All Contacts
          </Link>
          <Link
            to={"/problem-2/?modal=B"}
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={handleShowB}
          >
            US Contacts
          </Link>
        </div>
      </div>
      {modal === "A" && <ModalA />}
      {modal === "B" && <ModalB />}
      {<ModalC />}
    </div>
  );
};

export default Problem2;
