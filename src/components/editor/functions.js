import { KeyBindingUtil, getDefaultKeyBinding } from "draft-js";

export default {
  // key binding
  keyBindingFn: e => {
    // a keyboard event obj is passed
    // check if a certain key is pressed
    // hasCommandModifier checks the event for ctrl/cmd
    if (
      KeyBindingUtil.hasCommandModifier(e) &&
      e.shiftKey &&
      e.keyCode === 88 /* 'x' key */
    ) {
      // return command value as a string
      return "strikethrough";
    }

    // ctrl+shift+h - highlight
    if (
      KeyBindingUtil.hasCommandModifier(e) &&
      e.shiftKey &&
      e.keyCode === 72 /* 'h'*/
    ) {
      return "highlight";
    }

    // ctrl+tab change level
    if (e.keyCode === 9 /* 'tab' */) {
      return { cmd: "tab", e };
    }

    // ctrl+k - link
    if (KeyBindingUtil.hasCommandModifier(e) && e.keyCode === 75 /* 
    k*/) {
      return "add-link";
    }

    // ctrl+shift+n- add note
    if (
      KeyBindingUtil.hasCommandModifier(e) &&
      e.shiftKey &&
      e.keyCode === 78 /* 
    n*/
    ) {
      return "add-note";
    }

    // to make sure we don’t break all the built-in key commands, if we don’t detect strikethrough, we want to make sure Draft.js still parses it and detects default commands.
    return getDefaultKeyBinding(e);
  }
};
