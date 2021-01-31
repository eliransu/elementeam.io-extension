import React from "react";
import { Select, Tag } from "antd";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ onSelect }) => {
  const mapSelectToColor = {
    Important: "green",
    Urgent: "gold",
    High: "volcano",
    Low: "gray",
  };
  const options = [
    { value: "Important" },
    { value: "Urgent" },
    { value: "High" },
    { value: "Low" },
  ];

  function tagRender(props) {
    const { value, closable, onClose } = props;

    return (
      <Tag
        color={mapSelectToColor[value]}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {value}
      </Tag>
    );
  }
  return (
    <Select
      mode="multiple"
      showArrow
      onChange={onSelect}
      maxTagCount="responsive"
      tagRender={tagRender}
      style={{ width: "100%" }}
      placeholder="Tags (optional)"
      options={options}
    />
  );
};
