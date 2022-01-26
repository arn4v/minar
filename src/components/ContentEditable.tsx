import React from "react";

function getCaretCharacterOffsetWithin(element: HTMLDivElement) {
  let caretOffset = 0;
  let sel = document.getSelection();

  if (sel.rangeCount > 0) {
    let range = document.getSelection().getRangeAt(0);
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }

  return caretOffset;
}

function setCaretPosition(element: HTMLDivElement, offset: number) {
  let range = document.createRange();
  let sel = document.getSelection();

  //select appropriate node
  var currentNode = null;
  var previousNode = null;

  for (var i = 0; i < element.childNodes.length; i++) {
    //save previous node
    previousNode = currentNode;

    //get current node
    currentNode = element.childNodes[i];
    //if we get span or something else then we should get child node
    while (currentNode.childNodes.length > 0) {
      currentNode = currentNode.childNodes[0];
    }

    //calc offset in current node
    if (previousNode != null) {
      offset -= previousNode.length;
    }
    //check whether current node has enough length
    if (offset <= currentNode.length) {
      break;
    }
  }
  //move caret to specified offset
  if (currentNode != null) {
    range.setStart(currentNode, offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

type Props = {
  html: string;
} & JSX.IntrinsicElements["div"];

export const ContentEditable = React.forwardRef<HTMLDivElement, Props>(
  ({ html, ...props }, ref) => {
    const [innerHtml, setInnerHtml] = React.useState(html);
    const isFocused = React.useRef(false);
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const position = getCaretCharacterOffsetWithin(innerRef.current);
      const timer = setTimeout(() => {
        setInnerHtml(html);
        if (isFocused.current) {
          setCaretPosition(innerRef.current, position);
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [html]);

    const onFocus = () => {
      isFocused.current = true;
      setInnerHtml(html);
    };

    const onBlur = () => {
      isFocused.current = false;
    };

    return (
      <div
        {...props}
        contentEditable={true}
        ref={(instance) => {
          innerRef.current = instance;

          if (typeof ref === "function") {
            ref(instance);
          } else if (ref !== null) {
            ref.current = instance;
          }
        }}
        onFocus={(e) => {
          onFocus();
          props.onFocus(e);
        }}
        onBlur={(e) => {
          onBlur();
          props.onBlur(e);
        }}
        dangerouslySetInnerHTML={{
          __html: innerHtml,
        }}
      />
    );
  }
);
