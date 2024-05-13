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
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineAuthorityPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ruleSet",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Authorization rule set to be used by minted NFTs.",
            ""
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Master Edition account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionUpdateAuthority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Update authority of the collection. This needs to be a signer so the candy",
            "machine can approve a delegate to verify minted NFTs to the collection."
          ]
        },
        {
          "name": "collectionDelegateRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata delegate record. The delegate is used to verify NFTs.",
            ""
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token Metadata program.",
            ""
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Instructions sysvar account.",
            ""
          ]
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization Rules program.",
            ""
          ]
        },
        {
          "name": "authorizationRules",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization rules account for the collection metadata (if any).",
            ""
          ]
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
      "name": "mintNft",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Payer for the mint (SOL) fees."
          ]
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Candy Machine program account.",
            "",
            "Candy machine account."
          ]
        },
        {
          "name": "candyMachineAuthorityPda",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Candy Machine authority account.",
            ""
          ]
        },
        {
          "name": "minter",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Minter account for validation and non-SOL fees."
          ]
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint account of the NFT. The account will be initialized if necessary.",
            "",
            "Must be a signer if:",
            "* the nft_mint account does not exist.",
            ""
          ]
        },
        {
          "name": "nftMintAuthority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Mint authority of the NFT before the authority gets transfer to the master edition account.",
            "",
            "If nft_mint account exists:",
            "* it must match the mint authority of nft_mint."
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the NFT. This account must be uninitialized.",
            ""
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master edition account of the NFT. The account will be initialized if necessary.",
            ""
          ]
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Destination token account (required for pNFT).",
            ""
          ]
        },
        {
          "name": "tokenRecord",
          "isMut": true,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token record (required for pNFT).",
            ""
          ]
        },
        {
          "name": "collectionDelegateRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection authority or metadata delegate record.",
            ""
          ]
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Master edition account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionUpdateAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Update authority of the collection NFT.",
            ""
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token Metadata program.",
            ""
          ]
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Token program."
          ]
        },
        {
          "name": "splAtaProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "SPL Associated Token program."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program."
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Instructions sysvar account.",
            ""
          ]
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SlotHashes sysvar cluster data.",
            ""
          ]
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization Rules program.",
            ""
          ]
        },
        {
          "name": "authorizationRules",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization rules account for the collection metadata (if any).",
            ""
          ]
        }
      ],
      "args": []
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "launchTime",
            "type": "i64"
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "launchTime",
            "type": "i64"
          },
          {
            "name": "tokenStandard",
            "type": "u8"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "metadataUrl",
            "type": "string"
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
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineAuthorityPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachineAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ruleSet",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Authorization rule set to be used by minted NFTs.",
            ""
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Master Edition account of the collection.",
            ""
          ]
        },
        {
          "name": "collectionUpdateAuthority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Update authority of the collection. This needs to be a signer so the candy",
            "machine can approve a delegate to verify minted NFTs to the collection."
          ]
        },
        {
          "name": "collectionDelegateRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata delegate record. The delegate is used to verify NFTs.",
            ""
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token Metadata program.",
            ""
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Instructions sysvar account.",
            ""
          ]
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization Rules program.",
            ""
          ]
        },
        {
          "name": "authorizationRules",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization rules account for the collection metadata (if any).",
            ""
          ]
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
      "name": "mintNft",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Payer for the mint (SOL) fees."
          ]
        },
        {
          "name": "launchpad",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Candy Machine program account.",
            "",
            "Candy machine account."
          ]
        },
        {
          "name": "candyMachineAuthorityPda",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Candy Machine authority account.",
            ""
          ]
        },
        {
          "name": "minter",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "Minter account for validation and non-SOL fees."
          ]
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Mint account of the NFT. The account will be initialized if necessary.",
            "",
            "Must be a signer if:",
            "* the nft_mint account does not exist.",
            ""
          ]
        },
        {
          "name": "nftMintAuthority",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Mint authority of the NFT before the authority gets transfer to the master edition account.",
            "",
            "If nft_mint account exists:",
            "* it must match the mint authority of nft_mint."
          ]
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the NFT. This account must be uninitialized.",
            ""
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Master edition account of the NFT. The account will be initialized if necessary.",
            ""
          ]
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Destination token account (required for pNFT).",
            ""
          ]
        },
        {
          "name": "tokenRecord",
          "isMut": true,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token record (required for pNFT).",
            ""
          ]
        },
        {
          "name": "collectionDelegateRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Collection authority or metadata delegate record.",
            ""
          ]
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Metadata account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Master edition account of the collection NFT.",
            ""
          ]
        },
        {
          "name": "collectionUpdateAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Update authority of the collection NFT.",
            ""
          ]
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Token Metadata program.",
            ""
          ]
        },
        {
          "name": "splTokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SPL Token program."
          ]
        },
        {
          "name": "splAtaProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "SPL Associated Token program."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "System program."
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Instructions sysvar account.",
            ""
          ]
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "SlotHashes sysvar cluster data.",
            ""
          ]
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization Rules program.",
            ""
          ]
        },
        {
          "name": "authorizationRules",
          "isMut": false,
          "isSigner": false,
          "isOptional": true,
          "docs": [
            "Token Authorization rules account for the collection metadata (if any).",
            ""
          ]
        }
      ],
      "args": []
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "launchTime",
            "type": "i64"
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "feeWallet",
            "type": "publicKey"
          },
          {
            "name": "feePercent",
            "type": "u32"
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
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "launchTime",
            "type": "i64"
          },
          {
            "name": "tokenStandard",
            "type": "u8"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "metadataUrl",
            "type": "string"
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
    }
  ]
};
