/*
    [
        {
            email: "",
            name: "",
            password: ""
        }
    ]

    email, name, password
    "", "", ""
*/

interface RawData {
    [key: string]:string
}


const convertJsonToCsv = async (data: RawData[], filename: string) => {
    if (!data.length) {
        return false;
    }

    let _header = Object.keys(data[0]);
    let _csv = data.map(_data => _header.map(_header_ => `${_data[_header_]}`).join(", ") + "\n").join("");

    if (!_csv) {
        return false;
    }

    _csv = _header.join(", ") + "\n" + _csv;


    // save the cv to a file and make it downloadable
    let blob = new Blob([_csv], { type: 'text/csv;charset=utf-8;' });

    let link = document.createElement("a");

    if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return true;
}

export default convertJsonToCsv