import React, { Component } from "react";

class VisibilityTracker extends Component {
  ref = React.createRef();
  async componentDidMount() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1) {
          this.props.onVisible();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (this.ref.current) {
      observer.observe(this.ref.current);
    }
  }

  render() {
    return <div ref={this.ref}>{this.props.children}</div>;
  }
}

export default VisibilityTracker;
