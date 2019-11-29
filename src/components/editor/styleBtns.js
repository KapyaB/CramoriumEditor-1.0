import React from "react";
const styleBtns = {
  basicInlineBtns: [
    {
      value: <strong>B</strong>,
      style: "BOLD"
    },

    {
      value: <em>I</em>,
      style: "ITALIC"
    },

    {
      value: <p style={{ textDecoration: "underline" }}>U</p>,
      style: "UNDERLINE"
    }
  ],

  advInlineBtns: [
    {
      value: <p style={{ textDecoration: "line-through" }}>abc</p>,
      style: "STRIKETHROUGH"
    },

    {
      value: "<>",
      style: "CODE"
    },

    {
      value: <p style={{ color: "#fff", background: "#e9ff32" }}>H</p>,
      style: "HIGHLIGHT"
    },

    {
      value: "Sup",
      style: "SUPERSCRIPT"
    },

    {
      value: "Sub",
      style: "SUBSCRIPT"
    },
    {
      value: "A-C",
      style: "ALIGN_C"
    },
    {
      value: "A-R",
      style: "ALIGN_R"
    },
    {
      value: "A-J",
      style: "ALIGN_J"
    }
  ],

  basicBlockBtns: [
    {
      value: "H1",
      block: "header-one"
    },
    {
      value: "H2",
      block: "header-two"
    },
    {
      value: "H3",
      block: "header-three"
    },

    {
      value: "H4",
      block: "header-four"
    },

    {
      value: "H5",
      block: "header-five"
    },

    {
      value: "H6",
      block: "header-six"
    },
    {
      value: <strong>"</strong>,
      block: "blockquote"
    },

    {
      value: "UL",
      block: "unordered-list-item"
    },

    {
      value: "OL",
      block: "ordered-list-item"
    }
  ]
};

export default styleBtns;
