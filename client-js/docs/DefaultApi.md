# BlogApi.DefaultApi

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**postsGet**](DefaultApi.md#postsGet) | **GET** /posts | Listar todos los posts
[**postsIdGet**](DefaultApi.md#postsIdGet) | **GET** /posts/{id} | Obtener un post específico
[**postsPost**](DefaultApi.md#postsPost) | **POST** /posts | Crear un nuevo post



## postsGet

> [Post] postsGet()

Listar todos los posts

Obtiene una lista de todos los posts del blog

### Example

```javascript
import BlogApi from 'blog_api';

let apiInstance = new BlogApi.DefaultApi();
apiInstance.postsGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[Post]**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## postsIdGet

> Post postsIdGet(id)

Obtener un post específico

Obtiene un post específico por su ID

### Example

```javascript
import BlogApi from 'blog_api';

let apiInstance = new BlogApi.DefaultApi();
let id = 56; // Number | ID del post a obtener
apiInstance.postsIdGet(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| ID del post a obtener | 

### Return type

[**Post**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## postsPost

> Post postsPost(postsPostRequest)

Crear un nuevo post

Crea un nuevo post en el blog

### Example

```javascript
import BlogApi from 'blog_api';

let apiInstance = new BlogApi.DefaultApi();
let postsPostRequest = new BlogApi.PostsPostRequest(); // PostsPostRequest | 
apiInstance.postsPost(postsPostRequest).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **postsPostRequest** | [**PostsPostRequest**](PostsPostRequest.md)|  | 

### Return type

[**Post**](Post.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

