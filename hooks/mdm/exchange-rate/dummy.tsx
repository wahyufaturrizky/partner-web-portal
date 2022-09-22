    const dummyExchange: { status: string,data:any ,message:string}[] = [
    { 
    "status": "SUCCESS",
    "data": {
        "rows": [
            {
                "code": "AUD",
                "name": "Australian Dollar",
                "value": "1",
                "sell": "10.173,68",
                "buy" : "10.070,96",
                "last_updated": "31/08/2022"
            },
            {
                "code": "BND",
                "name": "Brunei Dollar",
                "value": "1",
                "sell": "10.677,77",
                "buy" : "10.567,75",
                "last_updated": "31/08/2022"
            },
            {
                "code": "CAD",
                "name": "Canadian Dollar",
                "value": "1",
                "sell": "11.391,78",
                "buy" : "11.275,00",
                "last_updated": "31/08/2022"
            }
        ],
        "totalRow": 3,
        "sort_by": [
            "code",
            "name"
        ]
    },
    "message": "list exchange rate"
    },
  ];
  export default dummyExchange