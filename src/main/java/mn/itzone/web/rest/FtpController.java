package mn.itzone.web.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("ftp")
public class FtpController {

    @Value("${file.directory}")
    String localDirectory = "/Users/sainturb/";

    File f = null;
    String[] paths;

    @GetMapping("list")
    public ResponseEntity<List<?>> getList(@RequestParam String path) throws Exception {
        try {
            if (path.equals("parent")) {
                f = new File(localDirectory);
            } else {
                f = new File(localDirectory + path);
            }
            paths = f.list();
            Arrays.sort(paths);
            List<String> stringList = new ArrayList<>();
            for( String one: paths) {
                if (one.charAt(0) != '.') {
                    if (one.contains(".")) {
                        if (one.contains(".mp4")) {
                            stringList.add(one);
                        }
                    } else {
                        stringList.add(one);
                    }
                }
            }
            return ResponseEntity.ok(stringList);
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("episodes")
    public ResponseEntity<List<?>> getEpisodes(@RequestParam String path) throws Exception {
        try {
            if (path.equals("parent")) {
                f = new File(localDirectory);
            } else {
                f = new File(localDirectory + path);
            }
            paths = f.list();
            Arrays.sort(paths);
            List<String> stringList = new ArrayList<>();
            for( String one: paths) {
                if (one.contains(".") && one.contains(".mp4")) {
                    stringList.add(one);
                }
            }
            return ResponseEntity.ok(stringList);
        } catch (Exception e) {
            throw e;
        }
    }

}
