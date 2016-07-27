import React from "react"
import cytoscape from "cytoscape"
import {DEF_VISUAL_STYLE} from "./VisualStyle"
import style from './style.css'

// TODO: consolidate Cytoscape-dependent tags
const CYTOSCAPE_TAG = 'cy';

// Original position will be used when layout is positions are available
const DEF_LAYOUT = 'cose';

// Layout to be used when there is no layout information
const DEF_NO_LAYOUT = 'cose';

const CY_EVENTS = {
  select: "select",
  unselect: 'unselect',
  add: 'add',
  remove: 'remove'
}


export default class CytoscapeRenderer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rendered: false
    }
  }

  updateCyjs(networkData) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Cytoscape.js is rendering new network...')
    this.state.rendered = true

    console.log(networkData);

    let network = networkData.toJS()
    console.log(network)

    let visualStyle = network.style

    if (visualStyle === undefined || visualStyle === null || visualStyle === {}) {
      visualStyle = DEF_VISUAL_STYLE
    }

    const cy = this.state.cyjs
    cy.style(visualStyle)
    cy.add(network.elements.nodes)
    cy.add(network.elements.edges)
    cy.layout({
      name: 'cose',
    })
    cy.fit()
  }

  componentDidMount() {
    // Create Cytoscape.js instance here, only once!
    const cy = cytoscape(
      Object.assign(
        {
          container: document.getElementById(CYTOSCAPE_TAG),
          elements: [],
          layout: {
            name: DEF_LAYOUT
          }
        }));
    this.setEventListener(cy)
    this.state.cyjs = cy
  }


  shouldComponentUpdate(nextProps, nextState) {
    console.log("$$$$$$$$$ Checking props")
    if (nextProps.networkData === this.props.networkData) {
      return false
    }
    console.log("********** Need UPDATE **********")
    return true
  }

  componentWillReceiveProps(nextProps) {
    console.log("*****Network prop changed, updating cytoscapejs")
    console.log(nextProps)
    console.log(this.props)

    const command = nextProps.commands.command
    if(command !== '') {

      const cy = this.state.cyjs
      if(command === 'fit') {
        cy.fit()
      }
      else if(command === 'zoomIn') {
        cy.zoom(cy.zoom() * 1.2)
      }
      else if(command === 'zoomOut') {
        cy.zoom(cy.zoom() * 0.8)
      }
      this.props.commandActions.reset()
      return
    }

    if (nextProps === undefined || nextProps.networkData === undefined) {
      console.log("=========== NO DATA");
      return
    }

    if (nextProps.networkData === this.props.networkData
      && this.state.rendered === true) {
      return
    }
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(this.state.rendered)
    if(!this.state.rendered) {
      this.updateCyjs(nextProps.networkData)
    }
  }

  render() {
    // Just add a div tag for Cytoscape.js.
    // Cytoscape.js can render result only when this section is available in DOM.
    return (
      <div id={CYTOSCAPE_TAG} className={style.cy}/>
    )
  }

  setEventListener(cy) {
    cy.on('data select unselect add remove', ev => {
      switch (ev.originalEvent.type) {
        case CY_EVENTS.select:
          let selected = ev.cyTarget;
          this.handleSelect(selected)
          break
        case CY_EVENTS.unselect:
          let unselected = ev.cyTarget;
          // this.handleSelect(unselected)
          break
        default:
          break
      }
    })
  }

  handleSelect(selected) {
    console.log('--------- graph object selected')
    console.log(selected)
    console.log(this.props)
    this.props.eventActions.selected(selected)
  }
}