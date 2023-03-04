# chatbot

This is a Chatbot which you can use in your terminal, based on langchain and open ai chat.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts --name "Jon Soeder"
```

The `--name` argument is optional, but if you want it to know.

## breaks

You can provide instructions to the chatbot from a "system" user to begin the conversation.  This will set the tone.  See [https://jailbreakchat.com] for some examples:

```bash
bun run index.ts --break path/to/break # should just be a plain text file
```

## history

The chatbot will store history in the logs folder.  If you want to control the name of the logfile

```bash
bun run index.ts --session whatever 
```

To start the chatbot with existing history

```bash
bun run index.ts --history logs/whatever
```

