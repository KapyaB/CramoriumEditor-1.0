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
  ],

  alignBts: [
    {
      value: "AL",
      style: "__TEXT_ALIGN_align-left",
      alignment: "align-left"
    },
    {
      value: "AC",
      style: "__TEXT_ALIGN_align-center",
      alignment: "align-center"
    },
    {
      value: "AJ",
      style: "__TEXT_ALIGN_align-justify",
      alignment: "align-justify"
    },
    {
      value: "AR",
      style: "__TEXT_ALIGN_align-right",
      alignment: "align-right"
    }
  ]
};

export default styleBtns;
