import React from "react";
const styleBtns = {
  basicInlineBtns: [
    {
      value: <i className="fas fa-bold" />,
      style: "BOLD"
    },

    {
      value: <i className="fas fa-italic" />,
      style: "ITALIC"
    },

    {
      value: <i className=" fas fa-underline" />,
      style: "UNDERLINE"
    }
  ],

  advInlineBtns: [
    {
      value: <i className="fas fa-strikethrough" />,
      style: "STRIKETHROUGH"
    },

    {
      value: <i className="fas fa-code" />,
      style: "CODE"
    },

    {
      value: <i className="fas fa-highlighter" />,
      style: "HIGHLIGHT"
    },

    {
      value: <i className="fas fa-superscript" />,
      style: "SUPERSCRIPT"
    },

    {
      value: <i className="fas fa-subscript" />,
      style: "SUBSCRIPT"
    }
  ],

  fontSizes: [
    {
      value: "Extra small",
      style: "fsize_EXTRA_SMALL"
    },
    {
      value: "Small",
      style: "fsize_SMALL"
    },
    {
      value: "Normal",
      style: "fsize_NORMAL"
    },
    {
      value: "Large",
      style: "fsize_LARGE"
    },
    {
      value: "Extra large",
      style: "fsize_EXTRA_LARGE"
    }
  ],

  basicBlockBtns: [
    {
      value: <i className="fas fa-quote-left" />,
      block: "blockquote"
    },

    {
      value: <i className="fas fa-list" />,
      block: "unordered-list-item"
    },

    {
      value: <i className="fas fa-list-ol" />,
      block: "ordered-list-item"
    }
  ],

  headers: [
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
    }
  ],

  alignBts: [
    {
      value: <i className="fas fa-align-left" />,
      style: "__TEXT_ALIGN_align-left",
      alignment: "align-left"
    },
    {
      value: <i className="fas fa-align-center" />,
      style: "__TEXT_ALIGN_align-center",
      alignment: "align-center"
    },
    {
      value: <i className="fas fa-align-justify" />,
      style: "__TEXT_ALIGN_align-justify",
      alignment: "align-justify"
    },
    {
      value: <i className="fas fa-align-right" />,
      style: "__TEXT_ALIGN_align-right",
      alignment: "align-right"
    }
  ]
};

export default styleBtns;
