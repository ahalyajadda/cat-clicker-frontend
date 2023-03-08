import React, { useEffect, useState } from 'react';
import './main.css';
import Cats from './Cats';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Main() {
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catClicks, setCatClicks] = useState(0);
  const [catNicknames, setCatNickNames] = useState('');
  const [catsInfo, setcatsInfo] = useState([]);
  let catAge = '';
  const [selected, setSelected] = useState('');
  const [newForm, setNewform] = useState(true);
  const [middleValues, setMiddleValues] = useState({
    name: '',
    visits: 0,
    catImage: '',
    nickNames: '',
    catAge: '',
  });

  //fteching  catsinfo
  const getCatsInfo = async () => {
    try {
      const response = await axios.get(
        'https://cats-backend-d6ep.onrender.com/cats/fetchCatsinfo'
      );
      await setcatsInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCatsInfo();
  }, []);

  //creating a cat-info
  const handleSubmit = async (e) => {
    e.preventDefault();
    catAge = '';

    if (catClicks >= 0 && catClicks <= 5) {
      catAge = 'infant';
      console.log(1);
    } else if (catClicks >= 6 && catClicks <= 12) {
      catAge = 'child';
      console.log(2);
    } else if (catClicks >= 13 && catClicks <= 25) {
      catAge = 'young';
      console.log(3);
    } else if (catClicks >= 26 && catClicks <= 40) {
      catAge = 'middle-age';
      console.log(4);
    } else if (catClicks >= 41 && catClicks <= 60) {
      catAge = 'old';
      console.log(5);
    } else if (catClicks >= 60) {
      catAge = 'very old';
      console.log(6);
    }
    try {
      if (catName == '' || catImage == '') {
        return alert('Fill all the fields');
      }
      const { data } = await axios.post(
        'https://cats-backend-d6ep.onrender.com/cats',
        {
          catName,
          catImage,
          catClicks,
          catNicknames,
          catAge,
        }
      );
      setNewform(false);
      await console.log(data);
      await setSelected(data._id);
      await getCatsInfo();
      await updateCenterData(data);
      await fetchCatDetails(data._id);
    } catch (err) {
      console.log(err);
    }
  };

  //empty the form fields
  const emptyInfo = async () => {
    setCatName('');
    setCatClicks(0);
    setCatImage('');
    setCatNickNames('');
  };

  //uploading cat images to cloudinary
  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      const { data } = await axios.post(
        'https://cats-backend-d6ep.onrender.com/upload',
        bodyFormData
      );
      await setCatImage(data.secure_url);
      console.log('hlo');
    } catch (err) {
      console.log(err);
    }
  };

  //fetching data based on id.
  const fetchCatDetails = async (val) => {
    try {
      const { data } = await axios.get(
        `https://cats-backend-d6ep.onrender.com/cats/${val}`
      );

      setCatName(data.name);
      setCatClicks(data.visits);
      setCatImage(data.catImage);
      setCatNickNames(data.nickNames);
    } catch (err) {
      console.log(err);
    }
  };

  //updating the existing cat data.
  const updateSubmit = async (e) => {
    e.preventDefault();
    console.log(catName, catImage, catClicks, catNicknames);

    try {
      const { data } = await axios.put(
        `https://cats-backend-d6ep.onrender.com/cats/${selected}`,
        {
          catName,
          catImage,
          catClicks,
          catNicknames,
        }
      );
      await console.log(data);
      await setSelected(data._id);

      await getCatsInfo();
      await updateCenterData(data);
      await fetchCatDetails();
    } catch (err) {
      console.log(err);
    }
  };

  //updating middle data.
  const updateCenterData = async (item) => {
    middleValues.name = item.name;
    middleValues.visits = item.visits;
    middleValues.catImage = item.catImage;
    middleValues.nickNames = item.nickNames;
    middleValues.catAge = item.catAge;
  };
  //increasing count.
  const updateCount = async (item, age) => {
    try {
      await axios.patch(
        `https://cats-backend-d6ep.onrender.com/cats/updateCount/${item._id}`,
        {
          visits: item.visits,
          catAge: age,
        }
      );
      getCatsInfo();
      fetchCatDetails(item._id);
    } catch (err) {
      console.log(err);
    }
  };

  //performing actions on selected cat
  const selectedCat = async (item) => {
    item.visits = item.visits + 1;
    const clicks = item.visits;
    let age = '';

    if (clicks >= 0 && clicks <= 5) {
      age = 'infant';
    } else if (clicks >= 6 && clicks <= 12) {
      age = 'child';
    } else if (clicks >= 13 && clicks <= 25) {
      age = 'young';
    } else if (clicks >= 26 && clicks <= 40) {
      age = 'middle-age';
    } else if (clicks >= 41 && clicks <= 60) {
      age = 'old';
    } else if (clicks >= 60) {
      age = 'very old';
    }
    item.catAge = age;
    updateCount(item, age);
    setNewform(false);
    setSelected(item._id);
    fetchCatDetails(item._id);
    updateCenterData(item);
  };

  return (
    <div className="main-page">
      <header id="middle">
        <hr />
        <h2>Cat Clicker App</h2>
        <hr />
      </header>
      <div className="main">
        {/* list of cats */}
        <div className="left">
          {['md'].map((expand) => (
            <Navbar key={expand} expand={expand} className="m-0">
              <Container fluid>
                <Navbar.Toggle
                  aria-controls={`offcanvasNavbar-expand-${expand}`}
                />
                <Navbar.Offcanvas
                  id={`offcanvasNavbar-expand-${expand}`}
                  aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                  placement="end"
                >
                  <Offcanvas.Header closeButton></Offcanvas.Header>
                  <div className="left-main">
                    {catsInfo.map((item, index) => (
                      <div
                        className="left-data"
                        onClick={() => selectedCat(item)}
                        style={{
                          backgroundColor:
                            item._id === selected ? 'rgb(8, 99, 218)' : '',
                          color: item._id === selected ? 'white' : 'gray',
                        }}
                      >
                        <Offcanvas.Body>
                          <Nav className="justify-center flex-column">
                            <Nav.Link href="">
                              <div
                                className="left-content"
                                style={{
                                  color:
                                    item._id === selected ? 'white' : 'gray',
                                }}
                              >
                                <p className="name">{item.name}</p>
                                <p className="visits"> {item.visits}</p>
                              </div>
                            </Nav.Link>
                          </Nav>
                        </Offcanvas.Body>
                      </div>
                    ))}
                  </div>
                </Navbar.Offcanvas>
              </Container>
            </Navbar>
          ))}
        </div>
        <div className="mid-form">
          {/* selected image */}
          <div className="middle">
            {selected === '' ? (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 'bold',
                }}
              >
                select one cat
              </div>
            ) : (
              <div className="cat-info">
                <Cats item={middleValues} middle="yes" />
              </div>
            )}
          </div>
          {/* form with selected data and with new form */}
          <div className="right">
            <div className="right-main">
              <div className="right-data">
                <button
                  style={{ backgroundColor: 'rgb(8, 99, 218)' }}
                  onClick={() => {
                    setNewform(true);
                    emptyInfo();
                  }}
                >
                  Open New Form
                </button>

                <form>
                  <label>Cat Name</label>
                  <br />
                  <input
                    required
                    type="text"
                    placeholder="Cat Name"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />{' '}
                  <br />
                  <label>Cat Image</label>
                  <br />
                  <input type="file" onChange={uploadHandler} /> <br />
                  <label>Cat Clicks</label>
                  <br />
                  <input
                    type="text"
                    placeholder="clicks"
                    value={catClicks}
                    onChange={(e) => setCatClicks(e.target.value)}
                  />{' '}
                  <br />
                  <label>Cat Nicknames</label>
                  <br />
                  <input
                    type="text"
                    placeholder="Nicknames"
                    value={catNicknames}
                    onChange={(e) => setCatNickNames(e.target.value)}
                  />{' '}
                  <br />
                  {newForm === true ? (
                    <button
                      style={{ backgroundColor: ' rgb(8, 204, 50)' }}
                      onClick={handleSubmit}
                    >
                      Create
                    </button>
                  ) : (
                    <button
                      style={{ backgroundColor: ' rgb(8, 204, 50)' }}
                      onClick={updateSubmit}
                    >
                      save
                    </button>
                  )}
                  <button
                    style={{ backgroundColor: 'red' }}
                    onClick={emptyInfo}
                  >
                    Undo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* cat image gallery */}
      <div className="image-gallery">
        <hr />
        <h2>Cats Image gallery</h2>

        <div className="cat-image">
          {catsInfo.map((item, index) => (
            <div
              className="cat-details"
              onClick={() => {
                selectedCat(item);
              }}
            >
              <a
                href="#middle"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <Cats item={item} middle="no" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
