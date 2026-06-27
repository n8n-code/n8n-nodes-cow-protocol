import type { INodeProperties } from 'n8n-workflow';

export const defaultDescription: INodeProperties[] = [
                {
			"displayName": "Operation",
			"name": "operation",
			"type": "options",
			"noDataExpression": true,
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					]
				}
			},
			"options": [
				{
					"name": "Create Order",
					"value": "Create Order",
					"action": "Create a new order. In order to replace an existing order with a new one, the appData must contain a [valid replacement order UID](https://github.com/cowprotocol/app-data/blob/main/src/schemas/v1.1.0.json#L62), then the indicated order is cancelled, and a new one placed.\nThis allows an old order to be cancelled AND a new order to be created in an atomic operation with a single signature.\nThis may be useful for replacing orders when on-chain prices move outside of the original order's limit price.",
					"description": "Create a new order. In order to replace an existing order with a new one, the appData must contain a [valid replacement order UID](https://github.com/cowprotocol/app-data/blob/main/src/schemas/v1.1.0.json#L62), then the indicated order is cancelled, and a new one placed.\nThis allows an old order to be cancelled AND a new order to be created in an atomic operation with a single signature.\nThis may be useful for replacing orders when on-chain prices move outside of the original order's limit price.",
					"routing": {
						"request": {
							"method": "POST",
							"url": "=/api/v1/orders"
						}
					}
				},
				{
					"name": "Cancel Orders",
					"value": "Cancel Orders",
					"action": "Cancel multiple orders by marking them invalid with a timestamp.",
					"description": "This is a *best effort* cancellation, and might not prevent solvers from settling the orders (if the order is part of an in-flight settlement transaction for example). Authentication must be provided by an [EIP-712](https://eips.ethereum.org/EIPS/eip-712) signature of an `OrderCancellations(bytes[] orderUids)` message.\n",
					"routing": {
						"request": {
							"method": "DELETE",
							"url": "=/api/v1/orders"
						}
					}
				},
				{
					"name": "Get Orders",
					"value": "Get Orders",
					"action": "Get existing orders from the list of UIDs.",
					"description": "Returns an array where each element is an object with either\nan \"order\" key containing the full order, or an \"error\" key\ncontaining the UID and a description of what went wrong.\n",
					"routing": {
						"request": {
							"method": "POST",
							"url": "=/api/v1/orders/by_uids"
						}
					}
				},
				{
					"name": "Get Order",
					"value": "Get Order",
					"action": "Get existing order from UID.",
					"description": "Get existing order from UID.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/orders/{{$parameter[\"UID\"]}}"
						}
					}
				},
				{
					"name": "Get Order Status",
					"value": "Get Order Status",
					"action": "Get the status of an order.",
					"description": "Get the status of an order.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/orders/{{$parameter[\"UID\"]}}/status"
						}
					}
				},
				{
					"name": "Get Orders By Tx Hash",
					"value": "Get Orders By Tx Hash",
					"action": "Get orders by settlement transaction hash.",
					"description": "Get orders by settlement transaction hash.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/transactions/{{$parameter[\"txHash\"]}}/orders"
						}
					}
				},
				{
					"name": "Get Trades v2",
					"value": "Get Trades v2",
					"action": "Get existing trades (paginated).",
					"description": "Exactly one of `owner` or `orderUid` must be set.\n\nResults are paginated and sorted by block number and log index descending (newest trades first).\n\nTo enumerate all trades start with `offset` 0 and keep increasing the\n`offset` by the total number of returned results. When a response\ncontains less than `limit` the last page has been reached.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v2/trades"
						}
					}
				},
				{
					"name": "Get Current Batch Auction",
					"value": "Get Current Batch Auction",
					"action": "Get the current batch auction.",
					"description": "The current batch auction that solvers should be solving right now. This\nincludes:\n\n* A list of solvable orders. * The block on which the batch was created.\n* Prices for all tokens being traded (used for objective value\ncomputation).\n\n**Note: This endpoint is currently permissioned. Reach out in discord if\nyou need access.**",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/auction"
						}
					}
				},
				{
					"name": "Get User Orders Paginated",
					"value": "Get User Orders Paginated",
					"action": "Get orders of one user paginated.",
					"description": "The orders are sorted by their creation date descending (newest orders\nfirst).\n\nTo enumerate all orders start with `offset` 0 and keep increasing the\n`offset` by the total number of returned results. When a response\ncontains less than `limit` the last page has been reached.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/account/{{$parameter[\"owner\"]}}/orders"
						}
					}
				},
				{
					"name": "Get Token Native Price",
					"value": "Get Token Native Price",
					"action": "Get native price for the given token.",
					"description": "Price is the exchange rate between the specified token and the network's\nnative currency.\n\nIt represents the amount of native token atoms needed to buy 1 atom of\nthe specified token.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/token/{{$parameter[\"token\"]}}/native_price"
						}
					}
				},
				{
					"name": "Quote",
					"value": "Quote",
					"action": "Quote a price and fee for the specified order parameters.",
					"description": "Given a partial order compute the minimum fee and a price estimate for the order. Return a full order that can be used directly for signing, and with an included signature, passed directly to the order creation endpoint.\n",
					"routing": {
						"request": {
							"method": "POST",
							"url": "=/api/v1/quote"
						}
					}
				},
				{
					"name": "Quote Stream",
					"value": "Quote Stream",
					"action": "Stream quotes from individual solvers as they arrive.",
					"description": "Accepts the same request body as `POST /api/v1/quote`. Instead of waiting for all solvers and returning the single best quote, this endpoint opens a Server-Sent Events stream and emits one event per quote as solvers respond. Solvers without a usable quote emit no event, so you may receive fewer events than there are solvers. The stream closes when the quote timeout elapses or all solvers have responded. Each event's `id` is always `null`. Clients can use this to show progressive quote updates in real time.\n\nThe `priceQuality` field of the request body is ignored: this endpoint always queries all solvers and attempts verification, emitting each result with its own `verified` flag. If no solver returns a usable quote, a terminal event named `error` is sent with a `PriceEstimationError` body before the stream closes.\n",
					"routing": {
						"request": {
							"method": "POST",
							"url": "=/api/v1/quote/stream"
						}
					}
				},
				{
					"name": "Get Solver Competition By Auction ID v2",
					"value": "Get Solver Competition By Auction ID v2",
					"action": "Get information about a solver competition.",
					"description": "Returns the competition information by `auction_id`.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v2/solver_competition/{{$parameter[\"auction_id\"]}}"
						}
					}
				},
				{
					"name": "Get Solver Competition By Tx Hash v2",
					"value": "Get Solver Competition By Tx Hash v2",
					"action": "Get information about solver competition.",
					"description": "Returns the competition information by `tx_hash`.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v2/solver_competition/by_tx_hash/{{$parameter[\"tx_hash\"]}}"
						}
					}
				},
				{
					"name": "Get Solver Competition Latest v2",
					"value": "Get Solver Competition Latest v2",
					"action": "Get information about the most recent solver competition.",
					"description": "Returns the competition information for the last seen auction_id.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v2/solver_competition/latest"
						}
					}
				},
				{
					"name": "Get API Version",
					"value": "Get API Version",
					"action": "Get the API's current deployed version.",
					"description": "Returns the git commit hash, branch name and release tag (code: https://github.com/cowprotocol/services).\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/version"
						}
					}
				},
				{
					"name": "Get App Data By Hash",
					"value": "Get App Data By Hash",
					"action": "Get the full `appData` from contract `appDataHash`.",
					"description": "Get the full `appData` from contract `appDataHash`.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/app_data/{{$parameter[\"app_data_hash\"]}}"
						}
					}
				},
				{
					"name": "Register App Data By Hash",
					"value": "Register App Data By Hash",
					"action": "Registers a full `appData` so it can be referenced by `appDataHash`.",
					"description": "Uploads a full `appData` to orderbook so that orders created with the corresponding `appDataHash` can be linked to the original full `appData`.\n",
					"routing": {
						"request": {
							"method": "PUT",
							"url": "=/api/v1/app_data/{{$parameter[\"app_data_hash\"]}}"
						}
					}
				},
				{
					"name": "Register App Data",
					"value": "Register App Data",
					"action": "Registers a full `appData` and returns `appDataHash`.",
					"description": "Uploads a full `appData` to orderbook and returns the corresponding `appDataHash`.\n",
					"routing": {
						"request": {
							"method": "PUT",
							"url": "=/api/v1/app_data"
						}
					}
				},
				{
					"name": "Get Address Total Surplus",
					"value": "Get Address Total Surplus",
					"action": "Get the total surplus earned by the user. [UNSTABLE]",
					"description": "### Caution\n\nThis endpoint is under active development and should NOT be considered\nstable.",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/api/v1/users/{{$parameter[\"address\"]}}/total_surplus"
						}
					}
				},
				{
					"name": "Debug Simulation Post",
					"value": "Debug Simulation Post",
					"action": "Simulate an arbitrary order.",
					"description": "Simulates an arbitrary order specified in the request body and returns the Tenderly simulation request, along with any simulation error if applicable.\n",
					"routing": {
						"request": {
							"method": "POST",
							"url": "=/restricted/api/v1/debug/simulation"
						}
					}
				},
				{
					"name": "Debug Simulation",
					"value": "Debug Simulation",
					"action": "Get Tenderly simulation request for an order.",
					"description": "Returns the Tenderly simulation request that would be used to simulate the given order, along with any simulation error if applicable.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/restricted/api/v1/debug/simulation/{{$parameter[\"uid\"]}}"
						}
					}
				},
				{
					"name": "Debug Order",
					"value": "Debug Order",
					"action": "Debug an order's lifecycle.",
					"description": "Returns a comprehensive debug report for the given order, including order details, lifecycle events, auction participation, proposed solutions, executions, trades, and settlement attempts.\n",
					"routing": {
						"request": {
							"method": "GET",
							"url": "=/restricted/api/v1/debug/order/{{$parameter[\"uid\"]}}"
						}
					}
				}
			],
			"default": ""
		},
		{
			"displayName": "POST /api/v1/orders",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Sell Token",
			"name": "sellToken",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "sellToken",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Buy Token",
			"name": "buyToken",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "buyToken",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "Receiver",
			"name": "receiver",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "receiver",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Sell Amount",
			"name": "sellAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "sellAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Buy Amount",
			"name": "buyAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "buyAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Valid To",
			"name": "validTo",
			"type": "number",
			"default": 0,
			"description": "see `OrderParameters::validTo`",
			"routing": {
				"send": {
					"property": "validTo",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Fee Amount",
			"name": "feeAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "feeAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Kind",
			"name": "kind",
			"type": "options",
			"default": "buy",
			"description": "Is this order a buy or sell?",
			"options": [
				{
					"name": "Buy",
					"value": "buy"
				},
				{
					"name": "Sell",
					"value": "sell"
				}
			],
			"routing": {
				"send": {
					"property": "kind",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Partially Fillable",
			"name": "partiallyFillable",
			"type": "boolean",
			"default": true,
			"description": "see `OrderParameters::partiallyFillable`",
			"routing": {
				"send": {
					"property": "partiallyFillable",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "Sell Token Balance",
			"name": "sellTokenBalance",
			"type": "options",
			"default": "erc20",
			"description": "Where should the `sellToken` be drawn from?\n\n**Only `erc20` is accepted for new orders.** The `internal` and `external`\n(Balancer Vault) sources are deprecated: orders using them are rejected at\ncreation with `UnsupportedSellTokenSource`. The values remain in the enum\nbecause they may still appear on historical orders returned by the API.",
			"options": [
				{
					"name": "Erc 20",
					"value": "erc20"
				},
				{
					"name": "Internal",
					"value": "internal"
				},
				{
					"name": "External",
					"value": "external"
				}
			],
			"routing": {
				"send": {
					"property": "sellTokenBalance",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "Buy Token Balance",
			"name": "buyTokenBalance",
			"type": "options",
			"default": "erc20",
			"description": "Where should the `buyToken` be transferred to?\n\n**Only `erc20` is accepted for new orders.** The `internal` (Balancer Vault)\ndestination is rejected at creation with `UnsupportedBuyTokenDestination`.\nThe value remains in the enum because it may still appear on historical\norders returned by the API.",
			"options": [
				{
					"name": "Erc 20",
					"value": "erc20"
				},
				{
					"name": "Internal",
					"value": "internal"
				}
			],
			"routing": {
				"send": {
					"property": "buyTokenBalance",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signing Scheme",
			"name": "signingScheme",
			"type": "options",
			"default": "eip712",
			"description": "How was the order signed?",
			"options": [
				{
					"name": "Eip 712",
					"value": "eip712"
				},
				{
					"name": "Ethsign",
					"value": "ethsign"
				},
				{
					"name": "Presign",
					"value": "presign"
				},
				{
					"name": "Eip 1271",
					"value": "eip1271"
				}
			],
			"routing": {
				"send": {
					"property": "signingScheme",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signature",
			"name": "signature",
			"type": "string",
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"description": "A signature.",
			"routing": {
				"send": {
					"property": "signature",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "From",
			"name": "from",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "from",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "Quote ID",
			"name": "quoteId",
			"type": "number",
			"default": 0,
			"description": "Orders can optionally include a quote ID. This way the order can be linked to a quote and enable providing more metadata when analysing order slippage.\n",
			"routing": {
				"send": {
					"property": "quoteId",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "App Data",
			"name": "appData",
			"type": "string",
			"default": "{\"version\":\"0.9.0\",\"metadata\":{}}",
			"description": "The string encoding of a JSON object representing some `appData`. The\nformat of the JSON expected in the `appData` field is defined\n[here](https://github.com/cowprotocol/app-data).\n",
			"routing": {
				"send": {
					"property": "appData",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "App Data Hash",
			"name": "appDataHash",
			"type": "string",
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000",
			"description": "32 bytes encoded as hex with `0x` prefix.\nIt's expected to be the hash of the stringified JSON object representing the `appData`.\n",
			"routing": {
				"send": {
					"property": "appDataHash",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "Full Balance Check",
			"name": "fullBalanceCheck",
			"type": "boolean",
			"default": false,
			"description": "If set to true, full sell amount will be checked during allowance and balance checking. This will ensure the account has correct allowance and available balance for the order to be created.\n",
			"routing": {
				"send": {
					"property": "fullBalanceCheck",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Create Order"
					]
				}
			}
		},
		{
			"displayName": "DELETE /api/v1/orders",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Cancel Orders"
					]
				}
			}
		},
		{
			"displayName": "Order Uids",
			"name": "orderUids",
			"type": "json",
			"default": "[\n  \"0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a\"\n]",
			"description": "Up to 128 UIDs of orders to cancel.",
			"routing": {
				"send": {
					"property": "orderUids",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ JSON.parse($value) }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Cancel Orders"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signature",
			"name": "signature",
			"type": "string",
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"description": "65 bytes encoded as hex with `0x` prefix. `r || s || v` from the spec.",
			"routing": {
				"send": {
					"property": "signature",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Cancel Orders"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signing Scheme",
			"name": "signingScheme",
			"type": "options",
			"default": "eip712",
			"description": "How was the order signed?",
			"options": [
				{
					"name": "Eip 712",
					"value": "eip712"
				},
				{
					"name": "Ethsign",
					"value": "ethsign"
				}
			],
			"routing": {
				"send": {
					"property": "signingScheme",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Cancel Orders"
					]
				}
			}
		},
		{
			"displayName": "POST /api/v1/orders/by_uids",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Orders"
					]
				}
			}
		},
		{
			"displayName": "Body",
			"name": "body",
			"type": "string",
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"routing": {
				"request": {
					"body": "={{ JSON.parse($value) }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Orders"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/orders/{UID}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Order"
					]
				}
			}
		},
		{
			"displayName": "UID",
			"name": "UID",
			"required": true,
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"type": "string",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Order"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/orders/{UID}/status",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Order Status"
					]
				}
			}
		},
		{
			"displayName": "UID",
			"name": "UID",
			"required": true,
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"type": "string",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Order Status"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/transactions/{txHash}/orders",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Orders By Tx Hash"
					]
				}
			}
		},
		{
			"displayName": "Tx Hash",
			"name": "txHash",
			"required": true,
			"default": "0xd51f28edffcaaa76be4a22f6375ad289272c037f3cc072345676e88d92ced8b5",
			"type": "string",
			"description": "32 byte digest encoded as a hex with `0x` prefix.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Orders By Tx Hash"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v2/trades",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Trades v2"
					]
				}
			}
		},
		{
			"displayName": "Owner",
			"name": "owner",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"type": "string",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"type": "query",
					"property": "owner",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Trades v2"
					]
				}
			}
		},
		{
			"displayName": "Order Uid",
			"name": "orderUid",
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"type": "string",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"routing": {
				"send": {
					"type": "query",
					"property": "orderUid",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Trades v2"
					]
				}
			}
		},
		{
			"displayName": "Offset",
			"name": "offset",
			"description": "The pagination offset. Defaults to 0.\n",
			"default": 0,
			"type": "number",
			"routing": {
				"send": {
					"type": "query",
					"property": "offset",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Trades v2"
					]
				}
			}
		},
		{
			"displayName": "Limit",
			"name": "limit",
			"description": "The maximum number of trades to return. Defaults to 10. Must be between 1 and 1000.\n",
			"default": 0,
			"type": "number",
			"routing": {
				"send": {
					"type": "query",
					"property": "limit",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Trades v2"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/auction",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Current Batch Auction"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/account/{owner}/orders",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get User Orders Paginated"
					]
				}
			}
		},
		{
			"displayName": "Owner",
			"name": "owner",
			"required": true,
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"type": "string",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get User Orders Paginated"
					]
				}
			}
		},
		{
			"displayName": "Offset",
			"name": "offset",
			"description": "The pagination offset. Defaults to 0.\n",
			"default": 0,
			"type": "number",
			"routing": {
				"send": {
					"type": "query",
					"property": "offset",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get User Orders Paginated"
					]
				}
			}
		},
		{
			"displayName": "Limit",
			"name": "limit",
			"description": "The pagination limit. Defaults to 10. Maximum 1000. Minimum 1.\n",
			"default": 0,
			"type": "number",
			"routing": {
				"send": {
					"type": "query",
					"property": "limit",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get User Orders Paginated"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/token/{token}/native_price",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Token Native Price"
					]
				}
			}
		},
		{
			"displayName": "Token",
			"name": "token",
			"required": true,
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"type": "string",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Token Native Price"
					]
				}
			}
		},
		{
			"displayName": "POST /api/v1/quote",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Quote"
					]
				}
			}
		},
		{
			"displayName": "POST /api/v1/quote<br/><br/>There's no body available for request, kindly use HTTP Request node to send body",
			"name": "operation",
			"type": "notice",
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Quote"
					]
				}
			}
		},
		{
			"displayName": "POST /api/v1/quote/stream",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Quote Stream"
					]
				}
			}
		},
		{
			"displayName": "POST /api/v1/quote/stream<br/><br/>There's no body available for request, kindly use HTTP Request node to send body",
			"name": "operation",
			"type": "notice",
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Quote Stream"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v2/solver_competition/{auction_id}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Solver Competition By Auction ID v2"
					]
				}
			}
		},
		{
			"displayName": "Auction ID",
			"name": "auction_id",
			"required": true,
			"default": 0,
			"type": "number",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Solver Competition By Auction ID v2"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v2/solver_competition/by_tx_hash/{tx_hash}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Solver Competition By Tx Hash v2"
					]
				}
			}
		},
		{
			"displayName": "Tx Hash",
			"name": "tx_hash",
			"required": true,
			"description": "Transaction hash in which the competition was settled.",
			"default": "0xd51f28edffcaaa76be4a22f6375ad289272c037f3cc072345676e88d92ced8b5",
			"type": "string",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Solver Competition By Tx Hash v2"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v2/solver_competition/latest",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Solver Competition Latest v2"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/version",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get API Version"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/app_data/{app_data_hash}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get App Data By Hash"
					]
				}
			}
		},
		{
			"displayName": "App Data Hash",
			"name": "app_data_hash",
			"required": true,
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000",
			"type": "string",
			"description": "32 bytes encoded as hex with `0x` prefix.\nIt's expected to be the hash of the stringified JSON object representing the `appData`.\n",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get App Data By Hash"
					]
				}
			}
		},
		{
			"displayName": "PUT /api/v1/app_data/{app_data_hash}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Register App Data By Hash"
					]
				}
			}
		},
		{
			"displayName": "App Data Hash",
			"name": "app_data_hash",
			"required": true,
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000",
			"type": "string",
			"description": "32 bytes encoded as hex with `0x` prefix.\nIt's expected to be the hash of the stringified JSON object representing the `appData`.\n",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Register App Data By Hash"
					]
				}
			}
		},
		{
			"displayName": "Full App Data",
			"name": "fullAppData",
			"type": "string",
			"default": "{\"version\":\"0.9.0\",\"metadata\":{}}",
			"description": "The string encoding of a JSON object representing some `appData`. The\nformat of the JSON expected in the `appData` field is defined\n[here](https://github.com/cowprotocol/app-data).\n",
			"routing": {
				"send": {
					"property": "fullAppData",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Register App Data By Hash"
					]
				}
			}
		},
		{
			"displayName": "PUT /api/v1/app_data",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Register App Data"
					]
				}
			}
		},
		{
			"displayName": "Full App Data",
			"name": "fullAppData",
			"type": "string",
			"default": "{\"version\":\"0.9.0\",\"metadata\":{}}",
			"description": "The string encoding of a JSON object representing some `appData`. The\nformat of the JSON expected in the `appData` field is defined\n[here](https://github.com/cowprotocol/app-data).\n",
			"routing": {
				"send": {
					"property": "fullAppData",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Register App Data"
					]
				}
			}
		},
		{
			"displayName": "GET /api/v1/users/{address}/total_surplus",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Address Total Surplus"
					]
				}
			}
		},
		{
			"displayName": "Address",
			"name": "address",
			"required": true,
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"type": "string",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Get Address Total Surplus"
					]
				}
			}
		},
		{
			"displayName": "POST /restricted/api/v1/debug/simulation",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Sell Token",
			"name": "sellToken",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "sellToken",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Buy Token",
			"name": "buyToken",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "buyToken",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Sell Amount",
			"name": "sellAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "sellAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Buy Amount",
			"name": "buyAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "buyAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Kind",
			"name": "kind",
			"type": "options",
			"default": "buy",
			"description": "Is this order a buy or sell?",
			"options": [
				{
					"name": "Buy",
					"value": "buy"
				},
				{
					"name": "Sell",
					"value": "sell"
				}
			],
			"routing": {
				"send": {
					"property": "kind",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Owner",
			"name": "owner",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "owner",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"displayName": "Receiver",
			"name": "receiver",
			"type": "string",
			"default": "0x6810e776880c02933d47db1b9fc05908e5386b96",
			"description": "20 byte Ethereum address encoded as a hex with `0x` prefix.",
			"routing": {
				"send": {
					"property": "receiver",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"displayName": "Sell Token Balance",
			"name": "sellTokenBalance",
			"type": "options",
			"default": "erc20",
			"description": "Where should the `sellToken` be drawn from?\n\n**Only `erc20` is accepted for new orders.** The `internal` and `external`\n(Balancer Vault) sources are deprecated: orders using them are rejected at\ncreation with `UnsupportedSellTokenSource`. The values remain in the enum\nbecause they may still appear on historical orders returned by the API.",
			"options": [
				{
					"name": "Erc 20",
					"value": "erc20"
				},
				{
					"name": "Internal",
					"value": "internal"
				},
				{
					"name": "External",
					"value": "external"
				}
			],
			"routing": {
				"send": {
					"property": "sellTokenBalance",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"displayName": "Buy Token Balance",
			"name": "buyTokenBalance",
			"type": "options",
			"default": "erc20",
			"description": "Where should the `buyToken` be transferred to?\n\n**Only `erc20` is accepted for new orders.** The `internal` (Balancer Vault)\ndestination is rejected at creation with `UnsupportedBuyTokenDestination`.\nThe value remains in the enum because it may still appear on historical\norders returned by the API.",
			"options": [
				{
					"name": "Erc 20",
					"value": "erc20"
				},
				{
					"name": "Internal",
					"value": "internal"
				}
			],
			"routing": {
				"send": {
					"property": "buyTokenBalance",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "App Data",
			"name": "appData",
			"type": "string",
			"default": "",
			"description": "Full app data JSON string.\n",
			"routing": {
				"send": {
					"property": "appData",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"displayName": "Block Number",
			"name": "blockNumber",
			"type": "number",
			"default": 0,
			"routing": {
				"send": {
					"property": "blockNumber",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signing Scheme",
			"name": "signingScheme",
			"type": "options",
			"default": "eip712",
			"description": "How was the order signed?",
			"options": [
				{
					"name": "Eip 712",
					"value": "eip712"
				},
				{
					"name": "Ethsign",
					"value": "ethsign"
				},
				{
					"name": "Presign",
					"value": "presign"
				},
				{
					"name": "Eip 1271",
					"value": "eip1271"
				}
			],
			"routing": {
				"send": {
					"property": "signingScheme",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Signature",
			"name": "signature",
			"type": "string",
			"default": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"description": "A signature.",
			"routing": {
				"send": {
					"property": "signature",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Fee Amount",
			"name": "feeAmount",
			"type": "string",
			"default": "1234567890",
			"description": "Amount of a token. `uint256` encoded in decimal.",
			"routing": {
				"send": {
					"property": "feeAmount",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Valid To",
			"name": "validTo",
			"type": "number",
			"default": 0,
			"description": "Unix timestamp (`uint32`) until which the order is valid.",
			"routing": {
				"send": {
					"property": "validTo",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"required": true,
			"displayName": "Partially Fillable",
			"name": "partiallyFillable",
			"type": "boolean",
			"default": true,
			"description": "Whether the order can be partially filled or must be filled all at once.",
			"routing": {
				"send": {
					"property": "partiallyFillable",
					"propertyInDotNotation": false,
					"type": "body",
					"value": "={{ $value }}"
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation Post"
					]
				}
			}
		},
		{
			"displayName": "GET /restricted/api/v1/debug/simulation/{uid}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation"
					]
				}
			}
		},
		{
			"displayName": "Uid",
			"name": "uid",
			"required": true,
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"type": "string",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation"
					]
				}
			}
		},
		{
			"displayName": "Block Number",
			"name": "block_number",
			"description": "Block number to simulate the order at. If not specified, the simulation uses the latest block.\n",
			"default": 0,
			"type": "number",
			"routing": {
				"send": {
					"type": "query",
					"property": "block_number",
					"value": "={{ $value }}",
					"propertyInDotNotation": false
				}
			},
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Simulation"
					]
				}
			}
		},
		{
			"displayName": "GET /restricted/api/v1/debug/order/{uid}",
			"name": "operation",
			"type": "notice",
			"typeOptions": {
				"theme": "info"
			},
			"default": "",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Order"
					]
				}
			}
		},
		{
			"displayName": "Uid",
			"name": "uid",
			"required": true,
			"default": "0xff2e2e54d178997f173266817c1e9ed6fee1a1aae4b43971c53b543cffcc2969845c6f5599fbb25dbdd1b9b013daf85c03f3c63763e4bc4a",
			"type": "string",
			"description": "Unique identifier for the order: 56 bytes encoded as hex with `0x`\nprefix.\n\nBytes 0..32 are the order digest, bytes 30..52 the owner address and\nbytes 52..56 the expiry (`validTo`) as a `uint32` unix epoch timestamp.",
			"displayOptions": {
				"show": {
					"resource": [
						"Default"
					],
					"operation": [
						"Debug Order"
					]
				}
			}
		},
];
