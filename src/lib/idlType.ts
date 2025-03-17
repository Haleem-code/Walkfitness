/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/walkfit.json`.
 */
export type Walkfit = {
    address: "GM5f46fyS98r5poAMx79jpHmkZRPNJiz6wtXmwsyfqGs";
    metadata: {
        name: "walkfit";
        version: "0.1.0";
        spec: "0.1.0";
        description: "Created with Anchor";
    };
    instructions: [
        {
            name: "createGame";
            docs: [
                "Creates a new game account.",
                "",
                "The game PDA is derived using:",
                'seeds = [b"game", creator.key().as_ref(), &game_id.to_le_bytes()]',
                "The bump is automatically computed.",
            ];
            discriminator: [124, 69, 75, 66, 184, 220, 72, 206];
            accounts: [
                {
                    name: "game";
                    docs: [
                        "The game account is a PDA derived from:",
                        'seeds = [b"game", creator.key().as_ref(), &game_id.to_le_bytes()]',
                        "This ties the game uniquely to the creator and game id.",
                    ];
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: "const";
                                value: [103, 97, 109, 101];
                            },
                            {
                                kind: "account";
                                path: "creator";
                            },
                            {
                                kind: "arg";
                                path: "gameId";
                            },
                        ];
                    };
                },
                {
                    name: "creator";
                    writable: true;
                    signer: true;
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
            ];
            args: [
                {
                    name: "gameId";
                    type: "u64";
                },
                {
                    name: "entryPrice";
                    type: "u64";
                },
            ];
        },
        {
            name: "endGame";
            docs: [
                "Ends the game and distributes the collected funds.",
                "",
                "Only the game creator can end the game.",
                "The total SOL in the game account is reduced by a 10% fee.",
                "The remaining funds are then distributed to three winners with a ratio of 50:30:20.",
            ];
            discriminator: [224, 135, 245, 99, 67, 175, 121, 252];
            accounts: [
                {
                    name: "game";
                    docs: ["The game account (PDA) holding the game state."];
                    writable: true;
                },
                {
                    name: "creator";
                    docs: ["The game creator ending the game."];
                    writable: true;
                    signer: true;
                },
                {
                    name: "first";
                    writable: true;
                },
                {
                    name: "second";
                    writable: true;
                },
                {
                    name: "third";
                    writable: true;
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
            ];
            args: [
                {
                    name: "first";
                    type: "pubkey";
                },
                {
                    name: "second";
                    type: "pubkey";
                },
                {
                    name: "third";
                    type: "pubkey";
                },
            ];
        },
        {
            name: "joinGame";
            docs: [
                "A player joins the game.",
                "",
                "This function:",
                "1. Checks that there is room for another player.",
                "2. Uses a CPI call (system_program transfer) to collect the required SOL (entry_price) from the player.",
                "3. Records the player's address in the game's players vector.",
            ];
            discriminator: [107, 112, 18, 38, 56, 173, 60, 128];
            accounts: [
                {
                    name: "game";
                    docs: [
                        "The game account. Its PDA is created as shown in CreateGame.",
                    ];
                    writable: true;
                },
                {
                    name: "player";
                    docs: ["The player joining the game."];
                    writable: true;
                    signer: true;
                },
                {
                    name: "systemProgram";
                    address: "11111111111111111111111111111111";
                },
            ];
            args: [];
        },
    ];
    accounts: [
        {
            name: "game";
            discriminator: [27, 90, 166, 125, 74, 100, 121, 18];
        },
    ];
    errors: [
        {
            code: 6000;
            name: "gameFull";
            msg: "The game already has the maximum number of players.";
        },
        {
            code: 6001;
            name: "unauthorized";
            msg: "Unauthorized: Only the game creator can end the game.";
        },
    ];
    types: [
        {
            name: "game";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "creator";
                        type: "pubkey";
                    },
                    {
                        name: "gameId";
                        type: "u64";
                    },
                    {
                        name: "entryPrice";
                        type: "u64";
                    },
                    {
                        name: "players";
                        type: {
                            vec: "pubkey";
                        };
                    },
                ];
            };
        },
    ];
};
