import React, { Component } from 'react';

export default class SelectPaginate extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Ahoj {this.props.postsPerPage}
            </div>
        );
    }
}