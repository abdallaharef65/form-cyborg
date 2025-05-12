// File: FlightSearchPage.jsx
import React, { useState } from "react";
import styles from "./TestPage.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Select, { components } from "react-select";

const FlightSearchPage = () => {
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  //   console.log("returnDate >>", returnDate);
  const formatDate = (date) => {
    return date ? (
      <>
        <span className={styles.dayName}>{format(date, "EEEE")}</span>
        <span className={styles.dayMonth}>{format(date, "MMMM d")}</span>
      </>
    ) : (
      <span className={styles.placeholder}>Select date</span>
    );
  };

  const CustomDateDisplay = React.forwardRef(({ onClick, content }, ref) => (
    <div className={styles.customDate} onClick={onClick} ref={ref}>
      {content}
    </div>
  ));

  const customOptions1 = [
    {
      value: "tourism",
      label: (
        <div className={styles.optionItem}>
          <span className={styles.routeIcon}>📍</span> Tourism
        </div>
      ),
    },
    {
      value: "business",
      label: (
        <div className={styles.optionItem}>
          <span className={styles.routeIcon}>📍</span> Business
        </div>
      ),
    },
  ];

  const customOptions2 = [
    {
      value: 1,
      label: (
        <div className={styles.optionItem}>
          <span className={styles.routeIcon}>📍</span> 1 Traveler
        </div>
      ),
    },
    {
      value: 2,
      label: (
        <div className={styles.optionItem}>
          <span className={styles.routeIcon}>📍</span> 2 Travelers
        </div>
      ),
    },
  ];

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <span className={styles.routeIcon}>▼</span>
        </components.DropdownIndicator>
      )
    );
  };
  return (
    <div className={styles.containerEn}>
      <div className={styles.routeBox}>
        <div className={styles.routeItem}>
          <span className={styles.routeIcon}>📍</span>
          <span>Riyadh, Saudi Arabia - King Khalid International Airport</span>
        </div>
        <div className={styles.routeItem}>
          <span className={styles.routeIcon}>📍</span>
          <span>Cairo, Egypt - Cairo International Airport</span>
        </div>
      </div>

      <div className={styles.dateBox}>
        <div className={styles.dateItem}>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            customInput={
              <CustomDateDisplay content={formatDate(departureDate)} />
            }
            calendarClassName={styles.calendar}
          />
        </div>

        <div className={styles.dateItem}>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            customInput={<CustomDateDisplay content={formatDate(returnDate)} />}
            calendarClassName={styles.calendar}
          />
        </div>
      </div>

      <div className={styles.optionsBox}>
        <Select
          options={customOptions1}
          components={{ DropdownIndicator }}
          classNamePrefix="custom"
        />

        <Select
          options={customOptions2}
          components={{ DropdownIndicator }}
          classNamePrefix="custom"
        />
      </div>
      <button className={styles.searchButton}>Search</button>
    </div>
  );
};

export default FlightSearchPage;
