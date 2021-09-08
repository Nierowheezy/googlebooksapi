import React, { useState } from "react";
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Spinner,
} from "reactstrap";
import BookCard from "./BookCard.jsx";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const MainHeader = () => {
  const url = process.env.REACT_APP_GOOGLE_BOOKS_API;
  const [maxResults, setMaxResults] = useState(10);
  const [startIndex, setStartIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

  const [query, setQuery] = useState("");

  const handlSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (maxResults > 40 || maxResults < 1) {
      toast.error("max results must be between 1 and 40");
    } else {
      try {
        const res = await axios.get(
          `${url}${query}&maxResults=${maxResults}&startIndex=${startIndex}`
        );
        if (startIndex >= res.data.totalItems || startIndex < 1) {
          toast.error(`max result must be between 1 and total items`);
        } else if (res.data.items.length > 0) {
          setCards(res.data.items);
          setLoading(false);
        }
      } catch (error) {
        setLoading(true);
        toast.error(`${error.response.data.error.message}`);
        setLoading(false);
      }
    }
  };

  const handleCards = () => {
    const items = cards.map((item, i) => {
      let thumbnail = "";

      if (item.volumeInfo.imageLinks) {
        thumbnail = item.volumeInfo.imageLinks.thumbnail;
      }

      return (
        <div className="col-lg-4  mb-3 mt-5" key={item.id}>
          <BookCard
            thumbnail={thumbnail}
            title={item.volumeInfo.title}
            pageCount={item.volumeInfo.pageCount}
            language={item.volumeInfo.language}
            authors={item.volumeInfo.authors}
            publisher={item.volumeInfo.publisher}
            description={item.volumeInfo.description}
            previewLink={item.volumeInfo.previewLink}
            infoLink={item.volumeInfo.infoLink}
          />
        </div>
      );
    });
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        </div>
      );
    } else {
      return (
        <div className="container-my-5">
          <div className="row">{items}</div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="main-image d-flex justify-content-center align-items-center flex-column">
        <div className="filter"></div>
        <h1
          className="display-2 text-center text-white mb-3"
          style={{ zIndex: "2" }}
        >
          Google Api Books
        </h1>
        <div style={{ width: "60%", zIndex: "2" }}>
          <InputGroup size="lg" className="mb-3">
            <Input
              placeholder="Search Books"
              valeu={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" size="lg" onClick={handlSubmit}>
                <i className="fas fa-search"></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <div className="d-flex text-white justify-content-center">
            <FormGroup className="ml-5">
              <label htmlFor="maxResults">Max Results</label>
              <Input
                type="number"
                id="maxResults"
                placeholder="Max Results"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
              />
            </FormGroup>

            <FormGroup className="ml-5">
              <label htmlFor="startIndex">Start Index</label>
              <Input
                type="number"
                id="startIndex"
                placeholder="Start Index"
                value={startIndex}
                onChange={(e) => setStartIndex(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
      {handleCards()}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
      />
    </>
  );
};

export default MainHeader;
