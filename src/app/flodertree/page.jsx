"use client";

import React, { useState } from "react";

const Folder = ({ name, children, depth = 0, path, onCreate, onDelete , activeFolder = "" ,onEdit}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {setIsOpen((prev) => !prev); onCreate(path);};

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item}"?`)) {
      onDelete(path, item);
    }
  };

  const handleEdit = (item) => {
    onEdit(path, item , prompt("Enter new name"));
  };

  const isFolder = children !== null;

  return (
    <div className={`ml-${depth * 4} bg-slate-900 w-fit`}>
      <div
        onClick={isFolder ? handleToggle : null}
        className={`flex items-center cursor-pointer w-fit ${
          isFolder ? "hover:bg-gray-800" : ""
        } ${activeFolder === path ? "border-2 border-indigo-400" : ""} p-2 gap-4 rounded group`}
      >
       <div className="flex items-center">
        <span className="mr-2">{isFolder ? (isOpen ? "📂" : "📁") : "📄"}</span>
        <span className={isFolder ? "font-semibold" : ""}>{name}</span>
        </div>

        <div className=" group-hover:flex hidden ">
            <button onClick={() => handleDelete(name)} className="text-white px-2 py-1 rounded ml-2 hover:bg-slate-400">🗑️</button>
            <button onClick={() => handleEdit(name)} className="text-white px-2 py-1 rounded ml-2 hover:bg-slate-400">🖊️</button>
        </div>
      </div>

      {isOpen && isFolder && (
        <div className="ml-6">
          {children && Object.keys(children).length > 0 ? (
            Object.entries(children).map(([childName, childContent]) => (
            <div className="flex items-center cursor-pointer p-2 rounded" key={childName}>
              <Folder
                key={childName}
                name={childName}
                children={childContent}
                depth={depth + 1}
                path={`${path}/${childName}`}
                onCreate={onCreate}
                onDelete={onDelete}
                activeFolder={activeFolder} 
                onEdit={onEdit}
              />
              </div>
            ))
          ) : (
            <div className="italic text-gray-500">Empty Folder</div>
          )}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [treeData, setTreeData] = useState({});
  const [pathSet, setPathSet] = useState(new Set());
  const [currActive , setCurrActive] = useState("");

  const addItem = (folderPath = currActive, itemName, isFolder = false) => {
    if (pathSet.has(folderPath+"/"+itemName)) {
    isFolder ? alert("Folder already exists in this folder.") :
      alert("Item already exists in this folder.");
      return;
    }
    const updateTree = (path, node) => {
      if (path.length === 0) {
        if (isFolder) {
          node[itemName] = []; 
        } else {
          node[itemName] = null; 
        }
        return node;
      }
      const [current, ...rest] = path;
      if (!node[current]) node[current] = [];
      node[current] = updateTree(rest, node[current]);
      return node;
    };
    setTreeData((prev) => updateTree( folderPath == "" ? [] : folderPath.split("/"), { ...prev }));
    setPathSet(prev => prev.add(folderPath+"/"+itemName));
  };

  const removeItem = (folderPath, itemName) => {
    const updateTree = (path, node) => {
      const [current, ...rest] = path;
       
      if(current === itemName) {
        pathSet.delete(folderPath);
        delete node[current];
        return node;
      }
      if (node[current]) {
        node[current] = updateTree(rest, node[current]);
      }
      return node;
    };

    setTreeData((prev) => updateTree(folderPath == "" ? [] : folderPath.split("/"), { ...prev }));
  };

  const onEdit = (folderPath, itemName , newName) => {
    const updateTree = (path, node) => {
        const [current, ...rest] = path;
         
        if(current === itemName) {
          if(pathSet.has(folderPath.replace(itemName, newName))) {
            alert("Folder already exists in this folder.");
            return node;
          }
          pathSet.delete(folderPath);
          pathSet.add(folderPath.replace(itemName, newName));
          node[newName] = node[current];
          delete node[current];
          return node;
        }
        if (node[current]) {
          node[current] = updateTree(rest, node[current]);
        }
        return node;
      };
    setTreeData((prev) => updateTree( folderPath == "" ? [] : folderPath.split("/"), { ...prev }));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between ">
        <h1 className="text-2xl font-bold mb-6 px-6">Folder Structure</h1>
        <div className="flex gap-8">
        <button onClick={() => addItem(currActive, prompt("Enter the name of the new file:"), false)} className="bg-blue-500 text-white px-4 py-2 rounded">+ 📄</button>
        <button onClick={() => addItem(currActive, prompt("Enter the name of the new folder:"), true)} className="bg-blue-500 text-white px-4 py-2 rounded">+ 🗂️</button>
        </div>
      </div>
      <div className="p-4 rounded shadow" id="tree">

        {!Object.entries(treeData).length ? 
        <button onClick={() => setTreeData({[prompt("Enter the name of the new file:")] : []})} className="bg-blue-500 text-white px-4 py-2 rounded">Add folder to Tree</button>
         : Object.entries(treeData).map(([key, value]) => (
          <Folder
            key={key}
            name={key}
            children={value}
            path={key} 
            onCreate={setCurrActive}
            onDelete={removeItem}
            activeFolder={currActive}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
