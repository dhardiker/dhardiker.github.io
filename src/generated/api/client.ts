import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const PublicLeaderboard = z.object({
  highscores: z.array(
    z.object({
      name: z.string(),
      highscore: z.number().int(),
      rank: z.number().int(),
    })
  ),
});
const submitScore_Body = z.object({
  scoreCode: z.string(),
  attendeeId: z.string(),
});
const AttendeeLeaderboard = z.object({
  newRank: z.number().int(),
  pointsBehind: z.number().int(),
  previousRank: z.number().int(),
  highscores: z.array(
    z.object({ gameId: z.string(), highscore: z.number().int() })
  ),
});
const ErrorResponse = z.object({
  error: z.object({
    errors: z.array(
      z.object({
        path: z.string().optional(),
        type: z.string().optional(),
        message: z.string(),
      })
    ),
  }),
});

export const schemas = {
  PublicLeaderboard,
  submitScore_Body,
  AttendeeLeaderboard,
  ErrorResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/leaderboard",
    alias: "getPublicLeaderboard",
    description: `Get the leaderboard`,
    requestFormat: "json",
    response: PublicLeaderboard,
  },
  {
    method: "get",
    path: "/leaderboard/:gameId",
    alias: "getPublicLeaderboardForGame",
    description: `Get the leaderboard for a game`,
    requestFormat: "json",
    response: PublicLeaderboard,
  },
  {
    method: "post",
    path: "/score",
    alias: "submitScore",
    description: `Submit a new score`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: submitScore_Body,
      },
    ],
    response: AttendeeLeaderboard,
    errors: [
      {
        status: 400,
        description: `Maybe malformed request, invalid, or missing data`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/test/data/snapshot",
    alias: "getTestDataSnapshots",
    description: `Get a list of the DB snapshots we have available for testing.`,
    requestFormat: "json",
    response: z.array(z.object({ name: z.string() })),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/test/data/snapshot",
    alias: "restoreTestDataSnapshot",
    description: `Restore a DB snapshots from those have available for testing.`,
    requestFormat: "json",
    parameters: [
      {
        name: "name",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.object({ restored: z.boolean() }),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
