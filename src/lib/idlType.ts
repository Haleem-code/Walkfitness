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
			discriminator: [124, 69, 75, 66, 184, 220, 72, 206];
			accounts: [
				{
					name: "game";
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
					type: "string";
				},
				{
					name: "entryPrice";
					type: "u64";
				},
			];
		},
		{
			name: "endGame";
			discriminator: [224, 135, 245, 99, 67, 175, 121, 252];
			accounts: [
				{
					name: "game";
					writable: true;
				},
				{
					name: "creator";
					writable: true;
					signer: true;
				},
				{
					name: "systemProgram";
					docs: ["Remaining accounts must be the recipients in order"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "reimburseList";
					type: {
						vec: {
							defined: {
								name: "reimburse";
							};
						};
					};
				},
			];
		},
		{
			name: "joinGame";
			discriminator: [107, 112, 18, 38, 56, 173, 60, 128];
			accounts: [
				{
					name: "game";
					writable: true;
				},
				{
					name: "player";
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
			name: "unauthorized";
			msg: "Only the game creator may end the game.";
		},
		{
			code: 6001;
			name: "invalidReimburseSum";
			msg: "Sum of reimbursements exceeds available pool.";
		},
		{
			code: 6002;
			name: "accountMismatch";
			msg: "Account in remaining_accounts does not match reimburse address.";
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
						type: "string";
					},
					{
						name: "entryPrice";
						type: "u64";
					},
				];
			};
		},
		{
			name: "reimburse";
			type: {
				kind: "struct";
				fields: [
					{
						name: "address";
						type: "pubkey";
					},
					{
						name: "amount";
						type: "u64";
					},
				];
			};
		},
	];
};
