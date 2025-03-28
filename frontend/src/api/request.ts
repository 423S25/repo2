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
    
    const value = await response.json()
    return value;
    
  }

  async get(this : APIRequest, queryParams? : Record<string,string>){
    const query = new URLSearchParams(queryParams);
    const response  = await fetch(`${this.baseURL}?${query}`).then(res => res.json())
    return response;
  }
  
  async post(this : APIRequest, body : any) : Promise<unknown>{
    const data = await this.request("POST", body);
    return data;
  }

  async delete(this : APIRequest, body : any){
    const data = await this.request("DELETE", body);
    return data;
  }

  async put(this : APIRequest, body : any){
    const data = await this.request("PUT", body);
    return data;
  }
  
}


export default APIRequest
