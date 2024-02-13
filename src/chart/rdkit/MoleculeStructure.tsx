import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import "./MoleculeStructure.css";
// import initRDKit from "../../utils/initRDKit";
import initRDKit from "./initRDKit";

class MoleculeStructure extends Component {
  static propTypes = {
    /**
     * Generic properties
     */
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    svgMode: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    /**
     * RDKit-specific properties
     */
    structure: PropTypes.string.isRequired,
    subStructure: PropTypes.string,
    extraDetails: PropTypes.object,
    drawingDelay: PropTypes.number
  };

  static defaultProps = {
    subStructure: "",
    className: "",
    width: 250,
    height: 200,
    svgMode: false,
    extraDetails: {},
    drawingDelay: undefined
  };

  constructor(props) {
    super(props);

    this.MOL_DETAILS = {
      width: this.props.width,
      height: this.props.height,
      bondLineWidth: 1,
      addStereoAnnotation: true,
      ...this.props.extraDetails
    };

    this.state = {
      svg: undefined,
      rdKitLoaded: false,
      rdKitError: false
    };
  }

  drawOnce = (() => {
    let wasCalled = false;

    return () => {
      if (!wasCalled) {
        wasCalled = true;
        this.draw();
      }
    };
  })();

  draw() {
    if (this.props.drawingDelay) {
      setTimeout(() => {
        this.drawSVGorCanvas();
      }, this.props.drawingDelay);
    } else {
      this.drawSVGorCanvas();
    }
  }

  drawSVGorCanvas() {
    const mol = window.RDKit.get_mol(this.props.structure || "invalid");
    const qmol = window.RDKit.get_qmol(this.props.subStructure || "invalid");
    const isValidMol = this.isValidMol(mol);

    if (this.props.svgMode && isValidMol) {
      const svg = mol.get_svg_with_highlights(this.getMolDetails(mol, qmol));
      this.setState({ svg });
    } else if (isValidMol) {
      const canvas = document.getElementById(this.props.id);
      mol.draw_to_canvas_with_highlights(canvas, this.getMolDetails(mol, qmol));
    }

    /**
     * Delete C++ mol objects manually
     * https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management
     */
    mol.delete();
    qmol.delete();
  }

  isValidMol(mol) {
    return !!mol && mol.is_valid();
  }

  getMolDetails(mol, qmol) {
    if (this.isValidMol(mol) && this.isValidMol(qmol)) {
      const subStructHighlightDetails = JSON.parse(
        mol.get_substruct_matches(qmol)
      );
      const subStructHighlightDetailsMerged = !_.isEmpty(
        subStructHighlightDetails
      )
        ? subStructHighlightDetails.reduce(
            (acc, { atoms, bonds }) => ({
              atoms: [...acc.atoms, ...atoms],
              bonds: [...acc.bonds, ...bonds]
            }),
            { bonds: [], atoms: [] }
          )
        : subStructHighlightDetails;
      return JSON.stringify({
        ...this.MOL_DETAILS,
        ...(this.props.extraDetails || {}),
        ...subStructHighlightDetailsMerged
      });
    } else {
      return JSON.stringify({
        ...this.MOL_DETAILS,
        ...(this.props.extraDetails || {})
      });
    }
  }

  componentDidMount() {
    initRDKit()
      .then(() => {
        this.setState({ rdKitLoaded: true });
        try {
          this.draw();
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ rdKitError: true });
      });
  }

  componentDidUpdate(prevProps) {
    if (
      !this.state.rdKitError &&
      this.state.rdKitLoaded &&
      !this.props.svgMode
    ) {
      this.drawOnce();
    }

    if (this.state.rdKitLoaded) {
      const shouldUpdateDrawing =
        prevProps.structure !== this.props.structure ||
        prevProps.svgMode !== this.props.svgMode ||
        prevProps.subStructure !== this.props.subStructure ||
        prevProps.width !== this.props.width ||
        prevProps.height !== this.props.height ||
        !_.isEqual(prevProps.extraDetails, this.props.extraDetails);

      if (shouldUpdateDrawing) {
        this.draw();
      }
    }
  }

  render() {
    if (this.state.rdKitError) {
      return "Error loading renderer.";
    }
    if (!this.state.rdKitLoaded) {
      return "Loading renderer...";
    }

    const mol = window.RDKit.get_mol(this.props.structure || "invalid");
    const isValidMol = this.isValidMol(mol);
    mol.delete();

    if (!isValidMol) {
      return (
        <span title={`Cannot render structure: ${this.props.structure}`}>
          Render Error.
        </span>
      );
    } else if (this.props.svgMode) {
      return (
        <div
          title={this.props.structure}
          className={"molecule-structure-svg " + (this.props.className || "")}
          style={{ width: this.props.width, height: this.props.height }}
          dangerouslySetInnerHTML={{ __html: this.state.svg }}
        ></div>
      );
    } else {
      return (
        <div
          className={
            "molecule-canvas-container " + (this.props.className || "")
          }
        >
          <canvas
            title={this.props.structure}
            id={this.props.id}
            width={this.props.width}
            height={this.props.height}
          ></canvas>
        </div>
      );
    }
  }
}

export default MoleculeStructure;

