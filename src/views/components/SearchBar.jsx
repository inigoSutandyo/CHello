import React from 'react'
import { FaSearch } from 'react-icons/fa'

export const SearchBar = ({
    setSearchCard,
    setSearchList
}) => {
  return (
    <div className="input-group my-3 w-50">
        <div className="w-25">
            <select name="select" id="select" className="form-control" onChange={() => {
            document.getElementById('search').value = ""
            setSearchCard("")
            setSearchList("")
            }}>
                <option value="List">List</option>
                <option value="Card">Card</option>
            </select>
        </div>
        <input type="text" className="form-control" name="search" id="search" placeholder="Search eg: label, title, etc." aria-label="Search" aria-describedby="btn-search"/>
        <button className="btn btn-outline-secondary" type="button" id="btn-search" onClick={() => {
            const searchTerm = document.getElementById('search').value.trim()
            const value = document.getElementById('select').value
            if (value === "List") {
                setSearchList(searchTerm)
            } else {
                setSearchCard(searchTerm)
            }
        }}>
            <FaSearch/>
        </button>
    </div>
  )
}
