import getCookie from "./cookie"; 


class APIRequest{
  baseURL : string;
  constructor(baseApi : string){
    this.baseURL = baseApi;
  }

  private getCSRFToken() : string {
      return getCookie('csrftoken');
  };

  private async request(this : APIRequest, method : string, body : BodyInit) {
    const requestInfo = new Request(this.baseURL, {
      method : method,
      headers: {"Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRFToken": this.getCSRFToken(),
             },
      body : JSON.stringify(body)

    });
    const response = await fetch(requestInfo);
    if (!response.ok){
      throw Error("HTTP Response Error")
    }
    const value = await response.json();
    return value;
    
  }

  async get(this : APIRequest, queryParams? : Record<string,string>){
    const query = new URLSearchParams(queryParams);
    return fetch(`${this.baseURL}?${query}`).then(res => res.json())
  }
  
  async post(this : APIRequest, body : any) : Promise<unknown>{
    return this.request("POST", body).then(res => res.json());
  }

  async delete(this : APIRequest, body : any){
    return this.request("DELETE", body).then(res => res.json());
  }

  async put(this : APIRequest, body : any){
    return this.request("PUT", body).then(res => res.json())
  }
  
}


export default APIRequest
