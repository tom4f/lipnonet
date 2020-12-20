import React from 'react';

interface ShowOneValueTypes {
    one: {
        name: string;
        id:   number;
    };
    selectedItems: number[];
    onSelectedItemsChange: (selectedItems: number[]) => void;
}
const ShowOneValue = ( { one, selectedItems, onSelectedItemsChange }: ShowOneValueTypes  ) => {


    const updCheckedList = (e: React.ChangeEvent<HTMLInputElement>) => {

        // change e.target.value to number
        const clickedValue = +e.target.value;

        const isClickedValuePresent:boolean = selectedItems.some( (oneSelected: number) => oneSelected === clickedValue );
        
        let newSelectedItems = isClickedValuePresent 
            ?  selectedItems.filter( (selectedItem:number) => clickedValue !== selectedItem )
            :  [ ...selectedItems, clickedValue ];
        
        onSelectedItemsChange(newSelectedItems);
    }


    const isChecked = (): boolean => selectedItems.some( (oneSelected: number) => oneSelected === one.id  )


    return (
        <li>
            <label>
                <input type="checkbox" 
                    onChange={ updCheckedList }
                    checked={isChecked()}
                    value={one.id}
                />
                {one.name}
            </label>
        </li>
    )
};


export { ShowOneValue };