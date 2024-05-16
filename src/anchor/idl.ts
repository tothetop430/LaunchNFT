export type LaunchnftContract = {
  "version": "0.1.0",
  "name": "launchnft_contract",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeParams"
          }
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateParams"
          }
        }
      ]
    },
    {
      "name": "createProject",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateProjectParams"
          }
        }
      ]
    },
    {
      "name": "setProjectData",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetProjectDataParams"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launchpad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "launchpadBump",
            "type": "u8"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          },
          {
            "name": "projectCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "projectNumber",
            "type": "u64"
          },
          {
            "name": "projectBump",
            "type": "u8"
          },
          {
            "name": "isCnft",
            "type": "bool"
          },
          {
            "name": "candyMachineId",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "createAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminWallet",
            "type": "publicKey"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminWallet",
            "type": "publicKey"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetProjectDataParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "candyMachineId",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateProjectParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isCnft",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflow",
      "msg": "Overflow in arithmetic operation"
    },
    {
      "code": 6001,
      "name": "InvalidAuthority",
      "msg": "Authority is invalid"
    },
    {
      "code": 6002,
      "name": "InvalidTokenStandard",
      "msg": "TokenStandard is invalid"
    },
    {
      "code": 6003,
      "name": "InvalidLaunchTime",
      "msg": "Launch time is invalid"
    },
    {
      "code": 6004,
      "name": "InvalidFeeWallet",
      "msg": "Fee wallet is invalid"
    }
  ]
};

export const IDL: LaunchnftContract = {
  "version": "0.1.0",
  "name": "launchnft_contract",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeParams"
          }
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateParams"
          }
        }
      ]
    },
    {
      "name": "createProject",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateProjectParams"
          }
        }
      ]
    },
    {
      "name": "setProjectData",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetProjectDataParams"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "launchpad",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "launchpadBump",
            "type": "u8"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          },
          {
            "name": "projectCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "projectNumber",
            "type": "u64"
          },
          {
            "name": "projectBump",
            "type": "u8"
          },
          {
            "name": "isCnft",
            "type": "bool"
          },
          {
            "name": "candyMachineId",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "createAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminWallet",
            "type": "publicKey"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminWallet",
            "type": "publicKey"
          },
          {
            "name": "backendWallet",
            "type": "publicKey"
          },
          {
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feeCollection",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetProjectDataParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "candyMachineId",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "CreateProjectParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isCnft",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MathOverflow",
      "msg": "Overflow in arithmetic operation"
    },
    {
      "code": 6001,
      "name": "InvalidAuthority",
      "msg": "Authority is invalid"
    },
    {
      "code": 6002,
      "name": "InvalidTokenStandard",
      "msg": "TokenStandard is invalid"
    },
    {
      "code": 6003,
      "name": "InvalidLaunchTime",
      "msg": "Launch time is invalid"
    },
    {
      "code": 6004,
      "name": "InvalidFeeWallet",
      "msg": "Fee wallet is invalid"
    }
  ]
};
