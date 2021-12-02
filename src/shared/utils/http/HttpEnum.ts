export enum ResponseEnum {
    SUCCESS = 'TKE010001',
    ERROR = 'TKE020001',
    UN_PASS = 'TKE040001',
    UN_AUTHORIZED = 'TKE040002',
}

export enum RequestMethodEnum {
    GET = 'GET',
    POST = 'POST'
}

export enum ContentTypeEnum {
    // json
    JSON = 'application/json',
    // form-data qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded',
    // form-data  upload
    FORM_DATA = 'multipart/form-data',
}
