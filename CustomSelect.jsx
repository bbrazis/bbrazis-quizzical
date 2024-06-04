import React from 'react'

const Icon = ({ isOpen }) => {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#222" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={isOpen ? 'translate' : ''}>
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    )
}

// CloseIcon
const CloseIcon = () => {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
}

export default function({ placeHolder, options, isMulti, isSearchable, onChange, align }) {
    const [showMenu, setShowMenu] = React.useState(false) // Controls the visibility of the dropdown menu
    const [selectedValue, setSelectedValue] = React.useState(isMulti ? [] : null) // Stores the selected value(s)
    const [searchValue, setSearchValue] = React.useState('') // Stores the value entered in the search input
    const searchRef = React.useRef() // Reference to the search input element
    const inputRef = React.useRef() // Reference to the custom select input element

    React.useEffect(()=>{
        setSearchValue('')
        if(showMenu && searchRef.current) searchRef.current.focus()
    },[showMenu])

    React.useEffect(()=>{
        const handler = (e) => {
            if(inputRef.current && !inputRef.current.contains(e.target)) setShowMenu(false)
        }

        window.addEventListener('click', handler)
        return () => {
            window.removeEventListener('click', handler)
        }
    })

    const handleInputClick = (e) => {
        setShowMenu(!showMenu)
    }

    const getDisplay = () => {
        if(!selectedValue || selectedValue.length === 0) placeHolder
        if(isMulti){
            return (
                <div className="dropdown-tags">
                    {
                        selectedValue.map((option,index) => (
                            <div key={`${option.value}-${index}`} className="dropdown-tag-item">
                                {option.label}
                                <span onClick={(e) => onTagRemove(e, option)} className="dropdown-tag-close">
                                    <CloseIcon />
                                </span>
                            </div>
                        ))
                    }
                </div>
            )
        }
        return selectedValue.label
    }

    const removeOption = (option) => selectedValue.filter((o) => o.value !== option.value)

    const onTagRemove = (e, option) => {
        e.stopPropagation()
        const newValue = removeOption(option)
        setSelectedValue(newValue)
        onChange(newValue)
    }

    const onItemClick = (option) => {
        let newValue
        if(isMulti) {
            if(selectedVlaue.findIndex((o) => o.value === option.value) >= 0) {
                newValue = removeOption(option)
            } else newValue = [...selectedValue, option]
        } else newValue = option
        setSelectedValue(newValue)
        onChange(newValue)
    }

    const isSelected = (option) => {
        if(isMulti) {
            return selectedValue.filter((o) => o.value === option.value).length
        }

        if(!selectedValue) false

        return selectedValue.value === option.value
    }

    const onSearch = (e) => setSearchValue(e.target.value)

    const getOptions = () => {
        if(!searchValue) options

        return options.filter((option) =>
            option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
        )
    }

    const optionList = () => {
        getOptions().map((option) => (
            <div onClick={() => onItemClick(option)} key={option.value} className={`dropdown-item ${isSelected(option) && "selected"}`} >
                {option.label}
            </div>
        ))
    }

    const Menu = () => (
        <div className={`dropdown-menu alignment--${align || 'auto'}`}>
            {
                isSearchable && (
                    <div className="search-box">
                        <input className="form-control" onChange={onSearch} value={searchValue} ref={searchRef} />
                    </div>
                )
            }
            {optionList}
        </div>
    )

    console.log(optionList)
    return (
        <div className="custom--dropdown-container">
            <div ref={inputRef} onClick={handleInputClick} className="dropdown-input">
                <div className={`dropdown-selected-value ${!selectedValue || selectedValue.length === 0 ? 'placeholder' : ''}`}>
                    {getDisplay()}
                </div>
                <div className="dropdown-tool">
                    <Icon isOpen={showMenu} />
                </div>
            </div>
            {
                console.log(showMenu)
            }
        </div>
    )
}