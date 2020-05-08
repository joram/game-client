/* eslint-disable */
/**
 * @fileoverview gRPC-Web generated client stub for pb
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.pb = require('./game-server_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.pb.GameServerClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.pb.GameServerPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pb.CreateUserRequest,
 *   !proto.pb.CreateUserResponse>}
 */
const methodDescriptor_GameServer_CreateUser = new grpc.web.MethodDescriptor(
  '/pb.GameServer/CreateUser',
  grpc.web.MethodType.UNARY,
  proto.pb.CreateUserRequest,
  proto.pb.CreateUserResponse,
  /**
   * @param {!proto.pb.CreateUserRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.CreateUserResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pb.CreateUserRequest,
 *   !proto.pb.CreateUserResponse>}
 */
const methodInfo_GameServer_CreateUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pb.CreateUserResponse,
  /**
   * @param {!proto.pb.CreateUserRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.CreateUserResponse.deserializeBinary
);


/**
 * @param {!proto.pb.CreateUserRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.pb.CreateUserResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.pb.CreateUserResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerClient.prototype.createUser =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/pb.GameServer/CreateUser',
      request,
      metadata || {},
      methodDescriptor_GameServer_CreateUser,
      callback);
};


/**
 * @param {!proto.pb.CreateUserRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.pb.CreateUserResponse>}
 *     A native promise that resolves to the response
 */
proto.pb.GameServerPromiseClient.prototype.createUser =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/pb.GameServer/CreateUser',
      request,
      metadata || {},
      methodDescriptor_GameServer_CreateUser);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pb.LoginRequest,
 *   !proto.pb.LoginResponse>}
 */
const methodDescriptor_GameServer_Login = new grpc.web.MethodDescriptor(
  '/pb.GameServer/Login',
  grpc.web.MethodType.UNARY,
  proto.pb.LoginRequest,
  proto.pb.LoginResponse,
  /**
   * @param {!proto.pb.LoginRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.LoginResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pb.LoginRequest,
 *   !proto.pb.LoginResponse>}
 */
const methodInfo_GameServer_Login = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pb.LoginResponse,
  /**
   * @param {!proto.pb.LoginRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.LoginResponse.deserializeBinary
);


/**
 * @param {!proto.pb.LoginRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.pb.LoginResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.pb.LoginResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerClient.prototype.login =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/pb.GameServer/Login',
      request,
      metadata || {},
      methodDescriptor_GameServer_Login,
      callback);
};


/**
 * @param {!proto.pb.LoginRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.pb.LoginResponse>}
 *     A native promise that resolves to the response
 */
proto.pb.GameServerPromiseClient.prototype.login =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/pb.GameServer/Login',
      request,
      metadata || {},
      methodDescriptor_GameServer_Login);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pb.RegisterToChannelRequest,
 *   !proto.pb.RegisterToChannelResponse>}
 */
const methodDescriptor_GameServer_RegisterToChannel = new grpc.web.MethodDescriptor(
  '/pb.GameServer/RegisterToChannel',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.pb.RegisterToChannelRequest,
  proto.pb.RegisterToChannelResponse,
  /**
   * @param {!proto.pb.RegisterToChannelRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.RegisterToChannelResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pb.RegisterToChannelRequest,
 *   !proto.pb.RegisterToChannelResponse>}
 */
const methodInfo_GameServer_RegisterToChannel = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pb.RegisterToChannelResponse,
  /**
   * @param {!proto.pb.RegisterToChannelRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.RegisterToChannelResponse.deserializeBinary
);


/**
 * @param {!proto.pb.RegisterToChannelRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pb.RegisterToChannelResponse>}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerClient.prototype.registerToChannel =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pb.GameServer/RegisterToChannel',
      request,
      metadata || {},
      methodDescriptor_GameServer_RegisterToChannel);
};


/**
 * @param {!proto.pb.RegisterToChannelRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.pb.RegisterToChannelResponse>}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerPromiseClient.prototype.registerToChannel =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/pb.GameServer/RegisterToChannel',
      request,
      metadata || {},
      methodDescriptor_GameServer_RegisterToChannel);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pb.SendToChannelRequest,
 *   !proto.pb.SendToChannelResponse>}
 */
const methodDescriptor_GameServer_SendToChannel = new grpc.web.MethodDescriptor(
  '/pb.GameServer/SendToChannel',
  grpc.web.MethodType.UNARY,
  proto.pb.SendToChannelRequest,
  proto.pb.SendToChannelResponse,
  /**
   * @param {!proto.pb.SendToChannelRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.SendToChannelResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pb.SendToChannelRequest,
 *   !proto.pb.SendToChannelResponse>}
 */
const methodInfo_GameServer_SendToChannel = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pb.SendToChannelResponse,
  /**
   * @param {!proto.pb.SendToChannelRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.SendToChannelResponse.deserializeBinary
);


/**
 * @param {!proto.pb.SendToChannelRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.pb.SendToChannelResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.pb.SendToChannelResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerClient.prototype.sendToChannel =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/pb.GameServer/SendToChannel',
      request,
      metadata || {},
      methodDescriptor_GameServer_SendToChannel,
      callback);
};


/**
 * @param {!proto.pb.SendToChannelRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.pb.SendToChannelResponse>}
 *     A native promise that resolves to the response
 */
proto.pb.GameServerPromiseClient.prototype.sendToChannel =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/pb.GameServer/SendToChannel',
      request,
      metadata || {},
      methodDescriptor_GameServer_SendToChannel);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.pb.GetTilesRequest,
 *   !proto.pb.GetTilesResponse>}
 */
const methodDescriptor_GameServer_GetTiles = new grpc.web.MethodDescriptor(
  '/pb.GameServer/GetTiles',
  grpc.web.MethodType.UNARY,
  proto.pb.GetTilesRequest,
  proto.pb.GetTilesResponse,
  /**
   * @param {!proto.pb.GetTilesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.GetTilesResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.pb.GetTilesRequest,
 *   !proto.pb.GetTilesResponse>}
 */
const methodInfo_GameServer_GetTiles = new grpc.web.AbstractClientBase.MethodInfo(
  proto.pb.GetTilesResponse,
  /**
   * @param {!proto.pb.GetTilesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.pb.GetTilesResponse.deserializeBinary
);


/**
 * @param {!proto.pb.GetTilesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.pb.GetTilesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.pb.GetTilesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.pb.GameServerClient.prototype.getTiles =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/pb.GameServer/GetTiles',
      request,
      metadata || {},
      methodDescriptor_GameServer_GetTiles,
      callback);
};


/**
 * @param {!proto.pb.GetTilesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.pb.GetTilesResponse>}
 *     A native promise that resolves to the response
 */
proto.pb.GameServerPromiseClient.prototype.getTiles =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/pb.GameServer/GetTiles',
      request,
      metadata || {},
      methodDescriptor_GameServer_GetTiles);
};


module.exports = proto.pb;

