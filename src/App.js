import "./App.css";

import axios from "axios";

import { useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel } from "react-responsive-carousel";

import dayjs from "dayjs";

import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

function App() {
  const [images, setImages] = useState([]);

  const [intervalz, setIntervalz] = useState(0);

  const [show, setShow] = useState(false);

  useEffect(() => {
    let inter;
    const getApi = async () => {
      try {
        const response = await axios.get(
          "https://dev.bfitds.com/api/default/demo-playlist/45/fa5326c2-4c6e-4d90-9b11-18b7c819599d"
        );

        setImages(response.data[0].playlist.playlistContents);

        setIntervalz(
          response.data[0].playlist.playlistContents[0].duration * 1000
        );

        let today = dayjs().format("YYYY-MM-DD");
        let startDate = dayjs(response.data[0].startDate).format("YYYY-MM-DD");
        let endDate = dayjs(response.data[0].endDate).format("YYYY-MM-DD");
        let isToday = dayjs(today).isBetween(startDate, endDate, null, "[]");
        var startTime = response.data[0].startAt.slice(0, -3);
        var endTime = response.data[0].endAt.slice(0, -3);
        let currentDate = new Date();

        startDate = new Date(currentDate.getTime());

        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        endDate = new Date(currentDate.getTime());

        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);

        if (isToday) {
          inter = setInterval(() => {
            let currTime = dayjs().format("hh:mm:ss");

            let currDate = new Date(currentDate.getTime());

            currDate.setHours(currTime.split(":")[0]);
            currDate.setMinutes(currTime.split(":")[1]);
            currDate.setSeconds(currTime.split(":")[2]);

            if (startDate <= currDate && endDate >= currDate) {
              console.log("hello");
              setShow(true);
            } else {
              setShow(false);
            }
          }, 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getApi();

    return () => { clearInterval(inter); };
  }, []);

  const onChange = (index, item) => {
    setIntervalz(item.props["data-interval"]);
  };

  return (
    <div className="App">
      {show && (
        <Carousel
          onChange={onChange}
          autoPlay
          interval={intervalz}
          infiniteLoop={true}
          showThumbs={false}
          stopOnHover={false}
        >
          {images.map((image) => {
            return (
              <div key={image.contentId} data-interval={image.duration * 1000}>
                <img alt="" src={image.fileName} />
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
}

export default App;
