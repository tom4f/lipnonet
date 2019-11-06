import React, { Component } from 'react';
// test
class SelectPaginate extends Component {

    selectPaginate = event => {
        const paginateSize = Number(event.target.value);
        const { paginate } = this.props;
        paginate({
            paginateSize : paginateSize
        });
    }

    render() {
        return (
            <select required name="selectPaginate" onChange={(e) => this.selectPaginate(e)} >
                <option value="10">Počet stránkování</option>
                <option value="5">  5</option>
                <option value="10">10</option>
                <option value="50">50</option>
            </select>
        );
    }
}

export default SelectPaginate;

// ReactJS call parent method
// https://stackoverflow.com/questions/26176519/reactjs-call-parent-method