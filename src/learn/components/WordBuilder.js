import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import Element from "./CardLayoutElement";

const WordBuilder = ({layout, setLayout, onChange}) => {

  const DEFAULT_BASE = 5
  const isShow = false;

  const deviceWidth = layout.width
  const [cardWidth, setCardWidth] = useState(deviceWidth - (DEFAULT_BASE * 2))
  const [cardHeight, setCardHeight] = useState(layout.height)

  useEffect(() => {
    const [newLayout, nHeight, rw] = translateLayout(deviceWidth, layout)
    setCardHeight(nHeight)
    setLayout(newLayout)
    selectShape(0)
  }, [])

  const translateLayout = (cardWidth, originLayout) => {
    const layout = JSON.parse(JSON.stringify(originLayout))
    const rw = cardWidth / layout.width
    const nHeight = layout.height * rw

    layout.width = cardWidth
    layout.height = nHeight
    layout?.elements?.map((element, index) => {
      element.x = twoDecimalTrunc(element.x * rw)
      element.y = twoDecimalTrunc(element.y * rw)
      if (element.type === 'BG_IMAGE' ) {
        element.width = twoDecimalTrunc(cardWidth)
        element.height = twoDecimalTrunc(nHeight)
      } else {
        element.width = twoDecimalTrunc(element.width * rw)
        element.height = twoDecimalTrunc(element.height * rw)
        element.fontSize = twoDecimalTrunc(element.fontSize)
        element.fontFamily = "Nanum Gothic"
      }
      return element
    })
    return [layout, nHeight, rw]
  }


  const [selectedId, selectShape] = useState(0)

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }
  }

  const updateLayout = () => {
    setLayout(JSON.parse(JSON.stringify(layout)))
  }

  // layout items

  const [layoutItems, setLayoutItems] = useState([])
  const [layoutItemIndex, setLayoutItemIndex] = useState(0)

  const addLayoutItem = (e) => {
    const index = layout?.elements?.length || 0

    if (layoutItemIndex >= 0) {
      const item = layoutItems[layoutItemIndex]
      layout.elements[index] = item
      if (item.type === 'BG_IMAGE') {
        layout.with = item.width
        layout.height = item.height
      }
      selectShape(index)
      updateLayout()
    }
  }

  const removeSelectedItem = (e) => {
    if (selectedId !== null) {
      layout.elements.splice(selectedId, 1)
      updateLayout()
      const index = layout?.elements?.length || 0
      selectShape(index > 0 ? index - 1 : null)
    }
  }

  const selectItem = (e) => {
    const i = e.target.value
    setLayoutItemIndex(i)
  }

  const selectedItem = () => {
    console.log("selectedId", selectedId)
    console.log("layout.elements", layout?.elements)
    if (layout?.elements) {
      return layout?.elements[selectedId]
    } else {
      return null
    }
  }
  const twoDecimalTrunc = num => Math.trunc(num * 100) / 100;

  useEffect(() => {
    //const [newLayout, nHeight, rw] = translateLayout(cardWidth, LayoutItems)
    //setLayoutItems(newLayout.elements.filter(item => !layout?.elements?.find(element => element.name === item.name)))
  }, [layout?.elements?.length])

  return (

    <Stage width={deviceWidth} height={cardHeight + 48} style={{border: "1px solid #cccccc"}}
           onMouseDown={checkDeselect}
           onTouchStart={checkDeselect}>
      <Layer>
        {layout?.elements?.map((element, index) => (
          <Element
            type={element.type}
            isSelected={index === selectedId}
            onSelect={() => {
              selectShape(index)
            }}
            key={index}
            shapeProps={{
              id: "element-" + index,
              index: index,
              x: element.x + DEFAULT_BASE,
              y: element.y + DEFAULT_BASE,
              text: element.value || element.name,
              fontSize: element.fontSize ? element.fontSize : 20,
              fontFamily: element.fontFamily,
              width: element.width ? element.width : element.type === 'BG_IMAGE' ? layout.width : undefined,
              height: element.height ? element.height : element.type === 'BG_IMAGE' ? layout.height : undefined,
              fill: element.color || '#ffffff',
              stroke: element.type === 'BG_IMAGE' ? '#aaaaaa' : '#000000',
              strokeWidth: element.type === 'BG_IMAGE' || !element.value ? 1 : 0,
              strokeEnabled: element.type === 'BG_IMAGE',
              draggable: element.type !== 'BG_IMAGE' && true /*selectedId === index*/,
              zIndex: element.type === 'BG_IMAGE' ? 0 : index + 1,
            }}
            onChange={onChange}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default WordBuilder;
